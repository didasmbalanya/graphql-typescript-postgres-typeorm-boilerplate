import { userSessionIdPrefix, redisSessionPrefix } from './constants';
import { Redis } from 'ioredis';

export const delAllSessions = async (userId: string, redis: Redis) => {
  const sessionIds = await redis.lrange(
    `${userSessionIdPrefix}${userId}`,
    0,
    -1,
  );
  const promises: any[] = [];
  sessionIds.forEach((session: any) => {
    promises.push(redis.del(`${redisSessionPrefix}${session}`));
  });
  await Promise.all(promises);
};
