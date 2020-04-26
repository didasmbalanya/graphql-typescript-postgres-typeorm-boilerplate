import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcrypt';
import { User } from '../../entity/user';
import {
  invalidLogin,
  unConfirmedEmail,
} from './../../shared/responseMessages';

export const resolvers: IResolvers = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => {
      return `Hello ${name} `;
    },
  },

  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session },
    ) => {
      const found = await User.findOne({
        where: { email },
      });

      if (!found) return invalidLogin;
      const valid = await bcrypt.compare(password, found.password);
      if (!valid) return invalidLogin;
      if (!found.confirmed) return unConfirmedEmail;

      // after successfull login
      session.userId = found.id;

      return null;
    },
  },
};
