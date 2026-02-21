import * as yup from 'yup';
import { VALID_LANGUAGE_CODES } from '@avoo/constants';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { OrderType } from '@avoo/hooks/types/orderType';

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
    .trim()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  bio: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
  headline: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null))
    .max(100, 'Headline must be at most 100 characters'),
  phone: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
  avatarUrl: yup
    .string()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
  avatarPreviewUrl: yup
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

export const customerSchema = yup
  .object({
    id: yup.number().nullable().optional(),
    name: yup.string().optional(),
    phone: yup.string().optional(),
    email: yup.string().email('Invalid email').optional(),
    notes: yup.string().optional(),
  })
  .nullable()
  .test('customer-validation', function (value) {
    // If completely missing
    if (!value || Object.keys(value).length === 0) {
      return this.createError({
        message: 'Choose a client or create a new one',
      });
    }

    if (typeof value.id === 'number') {
      return true;
    }

    if (!value.name?.trim()) {
      return this.createError({
        path: `${this.path}.name`,
        message: 'Name is required',
      });
    }

    if (!value.phone?.trim()) {
      return this.createError({
        path: `${this.path}.phone`,
        message: 'Phone is required',
      });
    }

    if (!value.email?.trim()) {
      return this.createError({
        path: `${this.path}.email`,
        message: 'Email is required',
      });
    }

    return true;
  });

export const ordersDataSchema = yup
  .array()
  .of(
    yup.object({
      type: yup.string().oneOf(Object.values(OrderType)).required('Order type is required'),
      serviceId: yup.number().when('type', {
        is: OrderType.Service,
        then: (schema) => schema.required('Select a service'),
        otherwise: (schema) => schema.notRequired(),
      }),
      combinationId: yup.number().when('type', {
        is: OrderType.Combination,
        then: (schema) => schema.required('Select a combination'),
        otherwise: (schema) => schema.notRequired(),
      }),
      masterId: yup.number().required('Select a master'),
      date: yup
        .string()
        .required('Select a date and time')
        .test('is-future-date', "Date and time can't be in the past", function (value) {
          if (!value) return false;
          const inputDate = new Date(value);
          const now = new Date();

          return inputDate >= now;
        }),
      notes: yup.string().optional(),
    }),
  )
  .min(1, 'At least one order is required')
  .required('ordersData is required');

export const createPrivateOrdersSchema = yup.object({
  ordersData: ordersDataSchema,
  customerData: customerSchema,
});

export const updateOrderStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf([
      OrderStatus.COMPLETED,
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.CANCELED,
    ])
    .required('Status is required'),
});

export const updateOrderSchema = yup.object({
  status: yup.string().oneOf([OrderStatus.CONFIRMED, OrderStatus.CANCELED]).optional(),
  duration: yup.number().positive().optional(),
  notes: yup.string().optional(),
  date: yup.string().optional(),
  masterId: yup.number().optional(),
});

export const createServiceSchema = yup.object({
  name: yup.string().min(3).required(),
  description: yup.string().min(5).required(),
  price: yup.number().min(1).required(),
  categoryId: yup.number().required(),
  durationMinutes: yup.number().min(1).required(),
  isActive: yup.boolean().required(),
  mediaIds: yup.array().of(yup.number().required()).required(),
  masterIds: yup
    .array()
    .of(yup.number().required())
    .required()
    .default([])
    .min(1, 'At least one master is required'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type VerifyCodeFormData = yup.InferType<typeof verifyCodeSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export type CreateMasterFormData = yup.InferType<typeof createMasterSchema>;
export type CreatePrivateOrdersData = yup.InferType<typeof createPrivateOrdersSchema>;
export type UpdateOrderStatusData = yup.InferType<typeof updateOrderStatusSchema>;
export type OrdersData = yup.InferType<typeof ordersDataSchema>;
export type UpdateOrderData = yup.InferType<typeof updateOrderSchema>;
export type CreateServiceFormData = yup.InferType<typeof createServiceSchema>;
