import {
  BaseResponse,
  GetCustomersResponse,
  GetCustomersQueryParams,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const CUSTOMER_ENDPOINT = '/customers';

export const customerApi = {
  async getCustomers(params: GetCustomersQueryParams) {
    const res = await apiClient.get<BaseResponse<GetCustomersResponse>>(CUSTOMER_ENDPOINT, {
      params,
    });
    return res.data;
  },
};
