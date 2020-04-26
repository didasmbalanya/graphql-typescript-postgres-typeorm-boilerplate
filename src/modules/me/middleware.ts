import { User } from './../../entity/user';
export default async (
  resolver: any,
  parent: any,
  args: any,
  context: any,
  info: any,
) => {
  // logger(parent, args, context, info)
  // before middleware
  const result = await resolver(parent, args, context, info);
  // after
  if (!context.session || !context.session.userId) return null;
  
  const user = User.findOne({ where: { id: context.session.userId } });
  if (!user) return null;
  
  return result;
};
