import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcrypt';
import * as yup from 'yup';
import { User } from '../../entity/User';
import { fomartYupErr } from '../../shared/formatValidationError';
import { duplicateEmail } from './errorMessages';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().max(255).min(5).notOneOf(['password']).required(),
});

export const resolvers: IResolvers = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => {
      return `Hello ${name} `;
    },
  },

  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (error) {
        return fomartYupErr(error);
      }
      const { username, email, password } = args;
      const foundUser = await User.findOne({
        where: { email },
        select: ['id'],
      });
      if (foundUser) return [{ path: 'email', message: duplicateEmail }];

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        username,
        email,
        password: hashedPassword,
      });

      await user.save();
      // return !!saved;
      return null;
    },
  },
};
