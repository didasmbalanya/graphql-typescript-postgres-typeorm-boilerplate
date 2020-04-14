import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { resolvers, typeDefs } from './graphql';
import { createConnTypeOrm } from './utils/typeormConn';


const server = new GraphQLServer({ typeDefs, resolvers });

const startServer = async() => {
  await createConnTypeOrm()
  await server.start(() => console.log('Server is running on localhost:4000'));
};

startServer();
