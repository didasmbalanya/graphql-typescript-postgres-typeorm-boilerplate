import { GraphQLClient } from 'graphql-request';
import { startServer } from '../../index';
import { User } from '../../entity/user';
import { duplicateEmail } from './errorMessages';

const user = {
  username: 'obione',
  email: 'obiemail1@yah00.com',
  password: 'password1234',
};

export const registerMutationGen = (username: string, email: string, password: string) => `
mutation {
  register(username:"${username}", email:"${email}", password:"${password}"){
    path
    message
  }
}`;

const mutation = registerMutationGen(user.username, user.email, user.password);

let client: GraphQLClient;
let app: import("http").Server | import("https").Server;
beforeAll(async () => {
  app = await startServer();
  const { port }: any = app.address();
  const host = `http://localhost:${port}`;
  client = new GraphQLClient(host);
});
afterAll(async () => {
  app.close()
})

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
  const mutation2 = registerMutationGen('Dexter', 'dexter', 'passy');
  const res = await client.request(mutation2);
  expect(res.register[0].path).toBe('email');
});
