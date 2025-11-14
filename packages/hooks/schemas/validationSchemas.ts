import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup
    .string()
    .nullable()
    .trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('You must agree to the terms'),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email')
    .trim(),
});

export const verifyCodeSchema = yup.object({
  code: yup
    .string()
    .transform((value) => {
      if (!value) return '';
      return value.toString().replace(/\D/g, '').slice(0, 6);
    })
    .required('Code is required')
    .length(6, 'Code must be 6 digits'),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type VerifyCodeFormData = yup.InferType<typeof verifyCodeSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;