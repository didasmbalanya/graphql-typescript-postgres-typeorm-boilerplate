import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import * as fs from 'fs';
import { createConnTypeOrm } from './utils/typeormConn';

const options = {
  port: process.env.NODE_ENV === 'test' ? 0 : 4000,
};
export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, './modules'));
  folders.forEach((folder) => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`),
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) });
  await createConnTypeOrm();
  return await server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port}`);
  });
};
