import { Redis } from 'ioredis';

interface Session extends Express.Session{
  userId: string
}

export type Resolver = (
  parent: any,
  args: any,
  context: {
    redis: Redis,
    url: String,
    session: Session,
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
    session: Session,
  },
  info: any,
) => any;
