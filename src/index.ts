import { User } from './entity/user';
import { schemaGen } from './utils/schemaGen';
import { GraphQLServer } from 'graphql-yoga';
import * as passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import * as session from 'express-session';
import * as connectSession from 'connect-redis';
import * as rateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';
import { redis } from './utils/redis';
import { confirmEmail, printKey } from './routes/confirmEmail';
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

  const limiter = rateLimit({
    store: new RateLimitRedisStore({
      client: redis,
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  server.express.use(limiter);

  const RedisStore = connectSession(session);
  server.express.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: redisSessionPrefix,
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
  server.express.get('/key/:id', printKey);

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
        callbackURL: 'http://localhost:4000/auth/twitter/callback',
        includeEmail: true,
      },
      async (_token, _tokenSecret, profile, cb) => {
        const { id, username, emails } = profile;

        try {
          let email = emails ? emails[0].value : null;

          let user = await User.findOne({
            where: [{ twitterId: id }, { email }],
          });

          if (!user) {
            user = await User.create({
              email,
              username: username,
              twitterId: id,
            }).save();
          } else if (user && !user.twitterId) {
            user.twitterId = id;
            user.save();
          } else {
            // login
          }

          return cb(null, { id: user.id });
        } catch (error) {
          console.log(error);
        }
      },
    ),
  );

  server.express.use(passport.initialize());

  server.express.get('/auth/twitter', passport.authenticate('twitter'));

  server.express.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    (req, res) => {
      try {
        const { id } = req.user as any;
        // create a session for the user
        (req.session as any).userId = id;

        // res.redirect('/');
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
      }
    },
  );

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
