import { schemaGen } from './utils/schemaGen';
import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectSession from 'connect-redis';
import { redis } from './utils/redis';
import { confirmEmail } from './routes/confirmEmail';
import { createConnTypeOrm } from './utils/typeormConn';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { redisSessionPrefix } from './utils/constants';

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: schemaGen(),
    context: ({ request }: ContextParameters) => ({
      redis,
      url: `${request.protocol}://${request.get('host')}`,
      session: request.session,
      req: request,
    }),
  });
  await createConnTypeOrm();

  const RedisStore = connectSession(session);
  server.express.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix:redisSessionPrefix
      }),
      name: 'myId',
      secret: process.env.SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV?.toLowerCase() === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  );
  server.express.get('/confirm/:id', confirmEmail);

  const cors = {
    credentials: true,
    origin: process.env.NODE_ENV === 'test' ? '*' : process.env.FRONTEND_HOST,
  };
  const options = {
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
    cors,
  };

  return await server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port}`);
  });
};
