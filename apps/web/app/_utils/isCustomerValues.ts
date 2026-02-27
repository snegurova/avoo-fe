import { CreateCustomerRequest, FindCustomerRequest } from '@avoo/axios/types/apiTypes';

export const isCustomerValues = (
  obj: CreateCustomerRequest | FindCustomerRequest | object | undefined,
): obj is CreateCustomerRequest => {
  return !!(
    obj &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.prototype.hasOwnProperty.call(obj, 'name') &&
    Object.prototype.hasOwnProperty.call(obj, 'email') &&
    Object.prototype.hasOwnProperty.call(obj, 'phone') &&
    Object.prototype.hasOwnProperty.call(obj, 'notes')
  );
};
