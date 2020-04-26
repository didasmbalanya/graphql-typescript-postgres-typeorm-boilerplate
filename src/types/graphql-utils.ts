import { Redis } from 'ioredis';

export type Resolver = (
  parent: any,
  args: any,
  context: {
    redis: Redis,
    url: String,
    session: any,
  },
  info: any,
) => any;

export type GQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: {
    redis: Redis,
    url: String,
    session: any,
  },
  info: any,
) => any;
