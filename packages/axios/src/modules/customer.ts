import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import type { components } from '@avoo/axios/types/generated';

type CustomerInfoDto = components['schemas']['CustomerInfoDto'];
type CreateCustomerDto = components['schemas']['CreateCustomerDto'];

const CUSTOMERS_ENDPOINT = '/customers';

export const customerApi = {
  async getCustomers() {
    const response =
      await apiClient.get<BaseResponse<{ items: CustomerInfoDto[] }>>(CUSTOMERS_ENDPOINT);

    return {
      ...response.data,
      data: response.data.data.items,
    };
  },

  async getCustomerById(id: number) {
    const response = await apiClient.get<BaseResponse<CustomerInfoDto>>(
      `${CUSTOMERS_ENDPOINT}/${id}`,
    );
    return response.data;
  },

  async createCustomer(body: CreateCustomerDto) {
    const response = await apiClient.post<BaseResponse<CustomerInfoDto>>(CUSTOMERS_ENDPOINT, body);
    return response.data;
  },

  async updateCustomer(id: number, body: Partial<CreateCustomerDto>) {
    const response = await apiClient.put<BaseResponse<CustomerInfoDto>>(
      `${CUSTOMERS_ENDPOINT}/${id}`,
      body,
    );
    return response.data;
  },

  async deleteCustomer(id: number) {
    const response = await apiClient.delete<BaseResponse<null>>(`${CUSTOMERS_ENDPOINT}/${id}`);
    return response.data;
  },
};
