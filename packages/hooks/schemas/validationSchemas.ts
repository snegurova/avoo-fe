import * as yup from 'yup';
import { VALID_LANGUAGE_CODES } from '@avoo/constants';

export const registerSchema = yup.object({
  name: yup.string().nullable().trim(),
  email: yup.string().required('Email is required').email('Please enter a valid email').trim(),
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
  email: yup.string().required('Email is required').email('Please enter a valid email').trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email').trim(),
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

export const createMasterSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email').trim(),
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  bio: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null))
    .test('bio-min-length', 'Bio must be longer than or equal to 10 characters', function (value) {
      if (!value) return true;
      return value.length >= 10;
    }),
  phone: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
  languages: yup
    .array()
    .of(
      yup
        .string()
        .oneOf([...VALID_LANGUAGE_CODES], 'Invalid language code')
        .required(),
    )
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : null))
    .default([]),
});

export const updateMasterSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email').trim(),
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  bio: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null))
    .test('bio-min-length', 'Bio must be longer than or equal to 10 characters', function (value) {
      if (!value) return true;
      return value.length >= 10;
    }),
  phone: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
  languages: yup
    .array()
    .of(
      yup
        .string()
        .oneOf([...VALID_LANGUAGE_CODES], 'Invalid language code')
        .required(),
    )
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : []))
    .default([]),
});

export const createPrivateOrdersSchema = yup.object({
  ordersData: yup
    .array()
    .of(
      yup.object({
        type: yup.string().oneOf(['SERVICE', 'COMBINATION']).required('Order type is required'),
        serviceId: yup.number().when('type', {
          is: 'SERVICE',
          then: (schema) => schema.required('serviceId is required for SERVICE type'),
          otherwise: (schema) => schema.notRequired(),
        }),
        combinationId: yup.number().when('type', {
          is: 'COMBINATION',
          then: (schema) => schema.required('combinationId is required for COMBINATION type'),
          otherwise: (schema) => schema.notRequired(),
        }),
        masterId: yup.number().required('masterId is required'),
        date: yup.string().required('date is required'),
        startTimeMinutes: yup
          .number()
          .min(0, 'startTimeMinutes must be >= 0')
          .max(1440, 'startTimeMinutes must be <= 1440')
          .required('startTimeMinutes is required'),
        notes: yup.string().nullable(),
      }),
    )
    .min(1, 'At least one order is required')
    .required('ordersData is required'),
  customerData: yup
    .object({
      id: yup.number().notRequired(),
      name: yup.string().notRequired(),
      phone: yup.string().required('Customer phone is required'),
      email: yup.string().email('Invalid email').notRequired(),
      notes: yup.string().notRequired(),
    })
    .notRequired(),
});

export const updateOrderStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'])
    .required('Status is required'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type VerifyCodeFormData = yup.InferType<typeof verifyCodeSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export type CreateMasterFormData = yup.InferType<typeof createMasterSchema>;
export type CreatePrivateOrdersData = yup.InferType<typeof createPrivateOrdersSchema>;
export type UpdateOrderStatusData = yup.InferType<typeof updateOrderStatusSchema>;
