import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { resolvers, typeDefs } from './graphql';
import { createConnTypeOrm } from './utils/typeormConn';

const server = new GraphQLServer({ typeDefs, resolvers });

const options = {
  port: process.env.NODE_ENV === 'test' ? 0 : 4000,
};
export const startServer = async () => {
  await createConnTypeOrm();
  return await server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port}`);
  });
};
