import * as bcrypt from 'bcrypt';
import { forgotPassLockAccount } from './lockAccount';
import { Context } from './../../types/graphql-utils';
import { logoutAll } from './../logout/resolvers';
import {
  sendWIthNodeMailer,
  PasswordResetEmail,
} from './../../utils/sendEmail';
import {
  invalidEmail,
  somethingWrong,
  invalidKeyl,
} from './../../shared/responseMessages';
import { IResolvers } from 'graphql-tools';
import { User } from '../../entity/user';
import { createUniqueLink } from '../../utils/confirmEmailLink';
import {
  passwordSchema,
  handleYupReturn,
} from '../../shared/formatValidationError';

export const resolvers: IResolvers = {
  Mutation: {
    forgotPassword: async (
      _,
      { email }: GQL.ILoginOnMutationArguments,
      { url, redis, session }: Context,
    ) => {
      const found = await User.findOne({
        where: { email },
      });

      if (!found) return invalidEmail;
      const urlVal = process.env.FRONTEND_URL || url;
      const frontEndlink = await createUniqueLink(
        urlVal,
        found.id,
        redis,
        'key',
      );
      const res = await sendWIthNodeMailer(
        found.email,
        frontEndlink,
        PasswordResetEmail,
      );
      logoutAll(session, redis);
      await forgotPassLockAccount(found.id, redis);

      return res.accepted.length ? null : somethingWrong;
    },
    changePassword: async (
      _,
      { key, newPassword }: GQL.IChangePasswordOnMutationArguments,
      { redis },
    ): Promise<object | null> => {
      try {
        const userId = await redis.get(key);
        if (userId) {
          const pass = await passwordSchema.validate(newPassword, {
            abortEarly: false,
          });
          const hashedPassword = await bcrypt.hash(pass, 10);
          const updatePromise = User.update(
            { id: userId },
            { password: hashedPassword, locked: false },
          );
          const delKey = redis.del(key);
          Promise.all([updatePromise, delKey]);
          return null;
        }
        throw invalidKeyl;
      } catch (error) {
        const res = handleYupReturn(error);
        return (
          res || {
            errors: error,
          }
        );
      }
    },
  },
};
