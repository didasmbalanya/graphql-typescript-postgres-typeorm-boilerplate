export const invalidLogin: GQL.IError[] = [
  { path: 'login', message: 'Invalid login data' } as GQL.IError,
];

export const unConfirmedEmail: GQL.IError[] = [
  { path: 'email', message: 'PLease confirm your email' } as GQL.IError,
];

export const invalidEmail: GQL.IError[] = [
  { path: 'email', message: 'email not found' } as GQL.IError,
];

export const invalidKeyl: GQL.IError[] = [
  { path: 'user', message: 'Invalid or expired action key' } as GQL.IError,
];

export const somethingWrong: GQL.IError[] = [
  {
    path: 'server',
    message: 'Something went wrong try action again',
  } as GQL.IError,
];

export const lockedError: GQL.IError[] = [
  {
    path: 'user',
    message: 'Forgot password triggered, account locked until action complete',
  } as GQL.IError,
];
