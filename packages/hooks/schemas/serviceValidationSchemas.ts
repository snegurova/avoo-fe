import { CreateServiceFormValues } from '@avoo/axios/types/apiTypes';
import * as yup from 'yup';

export const createServiceSchema: yup.ObjectSchema<CreateServiceFormValues> = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  categoryId: yup.number().required(),
  durationMinutes: yup.number().required(),
  isActive: yup.boolean().required(),
  mediaIds: yup.array().of(yup.number().required()).required(),
  masterIds: yup.array().of(yup.number().required()).required(),
});

export type CreateServiceFormValuesType = yup.InferType<typeof createServiceSchema>;
