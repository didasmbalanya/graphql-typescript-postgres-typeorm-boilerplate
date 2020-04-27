import { User } from './../../entity/user';
import { delAllSessions } from './../../utils/removeAllSessions';
import { Redis } from 'ioredis';

export const forgotPassLockAccount = async (userId: string, redis: Redis) => {
  await delAllSessions(userId, redis);
  await User.update({ id: userId }, { locked: true });
};
