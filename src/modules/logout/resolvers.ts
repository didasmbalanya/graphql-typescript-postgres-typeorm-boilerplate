import { IResolvers } from 'graphql-tools';

export const resolvers: IResolvers = {
  Mutation: {
    logout: (_, __, { session }: { session: Express.Session }, ___) =>
      new Promise((res) =>
        session.destroy((err) => {
          if (err) console.log('logout err: ', err);
          res(true);
        }),
      ),
  },
};
