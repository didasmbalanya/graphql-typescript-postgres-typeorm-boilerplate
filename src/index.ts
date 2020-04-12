import { createTypeormConnection } from './utils/createConnectOrm';
import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { resolvers, typeDefs } from './graphql';

export const startServer = async () => {
  try {
    const server = new GraphQLServer({ typeDefs, resolvers });
    createTypeormConnection()
    await server.start(() =>
      console.log('Server is running on localhost:4000'),
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
