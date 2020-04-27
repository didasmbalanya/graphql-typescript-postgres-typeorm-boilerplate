import * as yup from 'yup';

export const fomartYupErr = (err: yup.ValidationError) => {
  let errors: IError[] = [];
  err.inner.forEach((error) => {
    errors.push({
      path: error.path,
      message: error.message,
    });
  });
  return errors;
};

export const handleYupReturn = (
  error: yup.ValidationError,
) => {
  if (error.name === 'ValidationError' && error.inner.length) {
    const errors = fomartYupErr(error);
    return {
      errors,
      status: 422,
    };
  }
  return false
};


// const specialCharError = 'Password must contain one special chararcter';
const lowercase = 'Password must contain one lowercase letter';
const uppercase = 'Password must contain one uppercase letter';
const digits = 'Password should contain atleast 1 number';

export const passwordSchema = yup
  .string()
  .trim()
  .min(5, 'Password is too short - should be 5 chars minimum.')
  .max(255)
  .required('Password value is required')
  .notOneOf(['password', 'qwerty'])
  .matches(/(?=.*[a-z])/, lowercase)
  .matches(/(?=.*[A-Z])/, uppercase)
  .matches(/(?=.*[0-9])/, digits);
// .matches(/(?=.*[!@#$%^&*])/, specialCharError); // rule for force special char


interface IError {
  path: string;
  message: string;
}
