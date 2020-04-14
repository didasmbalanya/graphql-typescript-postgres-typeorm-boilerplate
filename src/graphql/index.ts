import * as path from "path";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";

const typesArray = fileLoader(path.join(__dirname, "."), { recursive: true });


export const typeDefs = mergeTypes(typesArray, { all: true });

export { resolvers } from './resolvers';

