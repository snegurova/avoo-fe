import { components } from './generated';
import { FileUpload, MediaUpload } from './apiTypes';

export type ObjectValues<T> = T[keyof T];

export type OrderStatus = components['schemas']['OrderEntity']['status'];

export const OrderStatusEnum = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED',
} as const satisfies Record<OrderStatus, OrderStatus>;

export type OrderStatusType = ObjectValues<typeof OrderStatusEnum>;

export const FILE_UPLOAD_TYPE_ENUM = {
  AVATAR: 'avatar',
  CERTIFICATE: 'certificate',
} as const satisfies Record<string, FileUpload>;

export const MEDIA_TYPE_ENUM = {
  USER: 'USER',
  POST: 'POST',
  SERVICE: 'SERVICE',
} as const satisfies Record<string, MediaUpload>;
