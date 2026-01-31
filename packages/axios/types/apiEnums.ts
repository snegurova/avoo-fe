import { components } from "./generated";

type ObjectValues<T> = T[keyof T];


export type OrderStatus = components['schemas']['OrderEntity']['status'];

export const OrderStatusEnum = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED',
} as const satisfies Record<OrderStatus, OrderStatus>;

export type OrderStatusType = ObjectValues<typeof OrderStatusEnum>;