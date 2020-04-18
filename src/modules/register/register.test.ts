import { GraphQLClient } from 'graphql-request';
import { startServer } from '../../index';
import { User } from '../../entity/User';
import { duplicateEmail } from './errorMessages';

const user = {
  username: 'obione',
  email: 'obiemail@yah00.com',
  password: 'password1234',
};

const mutationGen = (username: string, email: string, password: string) => `
mutation {
  register(username:"${username}", email:"${email}", password:"${password}"){
    path
    message
  }
}`;

const mutation = mutationGen(user.username, user.email, user.password);

let client: GraphQLClient;
beforeAll(async () => {
  const app = await startServer();
  const { port }: any = app.address();
  const host = `http://localhost:${port}`;
  client = new GraphQLClient(host);
});

test('creates a user', async () => {
  const res = await client.request(mutation);
  const [foundUser] = await User.find({ email: user.email });

  expect(res.register).toEqual(null);
  expect(foundUser.email).toBe(user.email);
});

test('Return error when user already exist', async () => {
  const res = await client.request(mutation);


  expect(res.register[0]).toEqual({
    path: 'email',
    message: duplicateEmail
  });
});

test('Validation Error', async () => {
  const mutation2 = mutationGen('Dexter', 'dexter', 'passy');
  const res = await client.request(mutation2);
  expect(res.register[0].path).toBe('email');
});
