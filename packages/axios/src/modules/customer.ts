import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import type { components } from '@avoo/axios/types/generated';

type CustomerInfoDto = components['schemas']['CustomerInfoDto'];
type CreateCustomerDto = components['schemas']['CreateCustomerDto'];

const CUSTOMERS_ENDPOINT = '/customers';

export const customerApi = {
  async getCustomers() {
    type PossibleResponse =
      | { status?: string; data?: { items?: CustomerInfoDto[]; pagination?: unknown } }
      | { status?: string; data?: CustomerInfoDto[] };

    const response = await apiClient.get<PossibleResponse>(CUSTOMERS_ENDPOINT);
    const payload = response.data;

    // If payload.data is an object containing `items` array (paginated)
    if (
      payload &&
      payload.data &&
      typeof payload.data === 'object' &&
      'items' in payload.data &&
      Array.isArray((payload.data as { items?: unknown }).items)
    ) {
      return {
        status: 'SUCCESS',
        data: (payload.data as { items: CustomerInfoDto[] }).items,
      } as BaseResponse<CustomerInfoDto[]>;
    }

    // If payload.data is already an array
    if (payload && Array.isArray(payload.data as unknown)) {
      return {
        status: (payload.status || 'SUCCESS').toUpperCase(),
        data: payload.data as CustomerInfoDto[],
      } as BaseResponse<CustomerInfoDto[]>;
    }

    // Fallback to typed cast of whatever the server returned
    return payload as BaseResponse<CustomerInfoDto[]>;
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
