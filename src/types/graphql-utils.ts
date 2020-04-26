import { Redis } from 'ioredis';

export interface Session extends Express.Session {
  userId: string;
}

export interface Context {
  session: Session;
  redis: Redis;
  req: Express.Request;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any,
) => any;

export type GQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any,
) => any;
