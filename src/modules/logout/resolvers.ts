import { Context, Session } from './../../types/graphql-utils';
import { IResolvers } from 'graphql-tools';
import { Redis } from 'ioredis';
import { delAllSessions } from '../../utils/removeAllSessions';

export const resolvers: IResolvers = {
  Mutation: {
    logout: async (_, __, { session, redis }: Context, ___) => {
      return await logoutAll(session, redis);
    },
  },
};

export const logoutAll = async (session: Session, redis: Redis) => {
  const { userId } = session;
  if (userId) {
    await delAllSessions(userId, redis);
    return true;
  }

  return false;
};
