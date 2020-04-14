import { getConnectionOptions, createConnection } from 'typeorm';

export const createConnTypeOrm = async () => {
  const createConnections = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...createConnections, name: "default"});
};
