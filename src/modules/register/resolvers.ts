import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcrypt';
import * as yup from 'yup';
import { User } from '../../entity/user';
import { fomartYupErr } from '../../shared/formatValidationError';
import { duplicateEmail } from './errorMessages';
import { createConfirmationLink } from '../../utils/confirmEmailLink';
import { sendWIthNodeMailer } from './../../utils/sendEmail';

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
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url },
    ) => {
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
      const urlVal = url || process.env.BACKEND_URL;
      const link = await createConfirmationLink(urlVal, user.id, redis);
      await sendWIthNodeMailer(email, link);

      return null;
    },
  },
};
