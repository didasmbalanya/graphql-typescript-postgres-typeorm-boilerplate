import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import * as fs from 'fs';
import Redis from 'ioredis';
import { createConnTypeOrm } from './utils/typeormConn';
import { User } from './entity/user';
import { ContextParameters } from 'graphql-yoga/dist/types';

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

  const redis = new Redis();
  const server = new GraphQLServer({
    schema: mergeSchemas({ schemas }),
    context: ({ request }:ContextParameters ) => ({ redis, url: `${request.protocol}://${request.get("host")}` }),
  });
  await createConnTypeOrm();

  server.express.get('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      res.status(200).send({
        data: {
          message: 'Email successfully confirmed',
        },
      });
    }
    res.status(404).send({
      error: {
        message: 'Something went wrong',
      },
    });
  });

  return await server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port}`);
  });
};
