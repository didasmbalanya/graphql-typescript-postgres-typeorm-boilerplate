import { GraphQLClient } from 'graphql-request';
import { startServer } from '../../index';
import { User } from '../../entity/User';


const user = {
  username: 'obione',
  email: 'obiemail@yahoo.com',
  password: 'password',
};

const mutation = `
mutation {
  register(username:"${user.username}", email:"${user.email}", password:"${user.password}")
}`;

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

  expect(res.register).toEqual(true);
  expect(foundUser.email).toBe(user.email);
});
