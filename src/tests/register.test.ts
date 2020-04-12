import { createConnection } from 'typeorm';
import { GraphQLClient } from 'graphql-request';
import { User } from '../entity/User';

const username = 'Bob';
const email = 'boboy@gmail.com';
const password = 'password';

const host = 'http://localhost:4000';
const client = new GraphQLClient(host);

const mutation = `mutation {
  register(email: "${email}", password: "${password}", username: "${username}")
}
`;

test('adds two nums', async () => {
  const response = await client.request(mutation);
  await createConnection();
  const users = await User.find({ where: { email } });
  const user = users[0];
  console.log(user);
  expect(response).toEqual({ register: true });
  expect(user.email).toBe(email);
});
