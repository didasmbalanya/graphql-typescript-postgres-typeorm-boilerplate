import { createMiddleware } from './../../utils/createMiddleware';
import { User } from './../../entity/user';
import { IResolvers } from 'graphql-tools';
import middleware from './middleware';

export const resolvers: IResolvers = {
  Query: {
    me: createMiddleware(middleware, async (_, __, { session }) => {
      return await User.findOne({ where: { id: session.userId } });
    }),
  },
};
