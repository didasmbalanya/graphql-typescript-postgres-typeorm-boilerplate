import { userSessionIdPrefix } from './../../utils/constants';
import { Context } from './../../types/graphql-utils';
import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcrypt';
import { User } from '../../entity/user';
import {
  invalidLogin,
  unConfirmedEmail,
  lockedError
} from './../../shared/responseMessages';

export const resolvers: IResolvers = {
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session, redis, req }: Context,
    ) => {
      const found = await User.findOne({
        where: { email },
      });

      if (!found) return invalidLogin;
      if (found.locked) return lockedError;
      const valid = await bcrypt.compare(password, found.password);
      if (!valid) return invalidLogin;
      if (!found.confirmed) return unConfirmedEmail;

      // after successfull login
      session.userId = found.id;
      if (req.sessionID) {
        redis.lpush(`${userSessionIdPrefix}${found.id}`, req.sessionID);
      }

      return null;
    },
  },
};
