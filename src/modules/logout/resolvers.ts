import {
  userSessionIdPrefix,
  redisSessionPrefix,
} from './../../utils/constants';
import { Context } from './../../types/graphql-utils';
import { IResolvers } from 'graphql-tools';

export const resolvers: IResolvers = {
  Mutation: {
    logout: async (_, __, { session, redis }: Context, ___) => {
      const { userId } = session;
      if (userId) {
        const sessionIds = await redis.lrange(
          `${userSessionIdPrefix}${userId}`,
          0,
          -1,
        );
        const promises: any[] = [];
        sessionIds.forEach((session) => {
          promises.push(redis.del(`${redisSessionPrefix}${session}`));
        });
        await Promise.all(promises);
        return true;
      }

      return false;
    },
  },
};
