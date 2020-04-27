import { v4 } from 'uuid';
import Redis from 'ioredis';

export const createUniqueLink = async (
  url: string,
  userId: string,
  redis: Redis.Redis,
  actionText: string = 'confirm',
): Promise<string> => {
  const time = actionText.toLowerCase() === 'key' ? 60 * 20 : 60 * 60 * 24;
  const id = v4();
  await redis.set(id, userId, 'ex', time);
  return `${url}/${actionText}/${id}`;
};
