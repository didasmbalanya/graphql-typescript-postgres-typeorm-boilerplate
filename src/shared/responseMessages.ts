export const invalidLogin: GQL.IError[] = [
  { path: 'login', message: 'Invalid login data' } as GQL.IError,
];

export const unConfirmedEmail: GQL.IError[] = [
  { path: 'email', message: 'PLease confirm your email' } as GQL.IError,
];



