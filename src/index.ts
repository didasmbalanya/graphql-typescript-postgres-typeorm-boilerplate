import { schemaGen } from './utils/schemaGen';
import { GraphQLServer } from 'graphql-yoga';
import { redis } from './utils/redis';
import { confirmEmail } from './routes/confirmEmail';
import { createConnTypeOrm } from './utils/typeormConn';
import { ContextParameters } from 'graphql-yoga/dist/types';

export const startServer = async () => {
  
  const server = new GraphQLServer({
    schema: schemaGen(),
    context: ({ request }: ContextParameters) => ({
      redis,
      url: `${request.protocol}://${request.get('host')}`,
    }),
  });
  await createConnTypeOrm();
  
  server.express.get('/confirm/:id', confirmEmail);
  
  const options = {
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  };
  return await server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port}`);
  });
};
