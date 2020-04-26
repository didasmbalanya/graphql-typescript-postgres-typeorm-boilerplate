export const invalidLogin: GQL.IError[] = [
  { path: 'login', message: 'Invalid login data' } as GQL.IError,
];

export const unConfirmedEmail: GQL.IError[] = [
  { path: 'email', message: 'PLease confirm your email' } as GQL.IError,
];

export const invalidEmail: GQL.IError[] = [
  { path: 'email', message: 'email not found' } as GQL.IError,
];

export const somethingWrong: GQL.IError[] = [
  { path: 'server', message: 'Something went wrong try action again' } as GQL.IError,
];



