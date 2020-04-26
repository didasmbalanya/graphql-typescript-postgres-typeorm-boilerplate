import { redis } from '../utils/redis';
import { User } from '../entity/user';
import { Response } from 'express';

export const confirmEmail = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = await redis.get(id);
  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    return res.status(200).send({
      data: {
        message: 'Email successfully confirmed',
      },
    });
  }
  return res.status(404).send({
    error: {
      message: 'Something went wrong',
    },
  });
};

export const printKey = async (req: any, res: Response) => {
  const { id } = req.params;

  return res.status(200).send({
    data: {
      message: `will redirect to frontend url with param: ${id}`,
    },
  });
};
