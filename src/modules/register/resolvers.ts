import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcrypt';
import { User } from '../../entity/User';

export const resolvers: IResolvers = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => {
      return `Hello ${name} `;
    },
  },
  Mutation: {
    register: async (
      _,
      { username, email, password }: GQL.IRegisterOnMutationArguments,
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        username,
        email,
        password: hashedPassword,
      });

      const saved = await user.save()
      return !!saved;
    },
  },
};
