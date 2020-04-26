import { v4 } from 'uuid';
import Redis from 'ioredis';

export const createUniqueLink = async (
  url: string,
  userId: string,
  redis: Redis.Redis,
  actionText: string = 'confirm',
): Promise<string> => {
  const id = v4();
  await redis.set(id, userId, 'ex', 60 * 60 * 24);
  return `${url}/${actionText}/${id}`;
};
