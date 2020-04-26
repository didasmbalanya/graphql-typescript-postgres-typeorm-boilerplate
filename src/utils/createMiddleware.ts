import { GQLMiddlewareFunc, Resolver } from './../types/graphql-utils';

export const createMiddleware = (
  middlewareFun: GQLMiddlewareFunc,
  resolverFun: Resolver,
) => (parent: any, args: any, context: any, info: any) =>
  middlewareFun(resolverFun, parent, args, context, info);
