import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { resolvers, typeDefs } from './graphql';
import { createConnection } from 'typeorm';

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log('Server is running on localhost:4000'));
});
