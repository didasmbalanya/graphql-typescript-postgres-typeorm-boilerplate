import { Context } from './../../types/graphql-utils';
import { logoutAll } from './../logout/resolvers';
import {
  sendWIthNodeMailer,
  PasswordResetEmail,
} from './../../utils/sendEmail';
import { invalidEmail, somethingWrong } from './../../shared/responseMessages';
import { IResolvers } from 'graphql-tools';
import { User } from '../../entity/user';
import { createUniqueLink } from '../../utils/confirmEmailLink';

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

      return res.accepted.length ? null : somethingWrong;
    },
  },
};
