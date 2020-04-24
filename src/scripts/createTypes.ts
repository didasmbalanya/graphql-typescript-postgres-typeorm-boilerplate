/* eslint-disable no-console */
import { generateNamespace } from '@gql2ts/from-schema';
import * as fs from 'fs';
import * as path from 'path';
import { schemaGen } from './../utils/schemaGen';

const myNamespace = generateNamespace('GQL', schemaGen());
fs.writeFile(path.join(__dirname, '../types/schema.d.ts'), myNamespace, (err) => console.log(err));
