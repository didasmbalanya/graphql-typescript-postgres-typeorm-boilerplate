import { User } from './../entity/User';
import { GraphQLClient } from 'graphql-request';
import { createConnTypeOrm } from '../utils/typeormConn';
// run server before running test

const host = 'http://localhost:4000';
const client = new GraphQLClient(host);

const user = {
  username: 'deddix',
  email: 'email@yahoo.com',
  password: 'notpassword',
};

const mutation = `
mutation {
  register(username:"${user.username}", email:"${user.email}", password:"${user.password}")
}`;

beforeAll(async () => {
  await createConnTypeOrm();
});

test('creates a user', async () => {
  const res = await client.request(mutation);
  const [foundUser] = await User.find({ email: user.email });
  console.log(foundUser)

  expect(res.register).toEqual(true);
  expect(foundUser.email).toBe(user.email)
});
