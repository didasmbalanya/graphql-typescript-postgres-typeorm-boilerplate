import { importSchema } from 'graphql-import';
import * as path from 'path';

export { resolvers } from './resolvers';
const schemaPath = path.join(__dirname, './schema.graphql')
export const typeDefs = importSchema(schemaPath); // or .gql or glob pattern like **/*.graphql
