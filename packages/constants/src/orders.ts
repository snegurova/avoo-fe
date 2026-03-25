import { OrderStatus } from '@avoo/hooks/types/orderStatus';

export const ORDER_STATUS_TRANSLATION_KEY = {
  [OrderStatus.PENDING]: 'pending',
  [OrderStatus.CONFIRMED]: 'confirmed',
  [OrderStatus.COMPLETED]: 'completed',
  [OrderStatus.CANCELED]: 'cancelled',
  [OrderStatus.EXPIRED]: 'expired',
  OUT_OF_SCHEDULE: 'outOfSchedule',
} as const;
