import { ValidationError } from 'yup';

export const fomartYupErr = (err: ValidationError) => {
  let errors: IError[] = [];
  err.inner.forEach((error) => {
    errors.push({
      path: error.path,
      message: error.message,
    });
  });
  return errors;
};

interface IError {
  path: string;
  message: string;
}
