import { BaseResponse, GetServiceResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import { PrivateServiceQueryParams } from '@avoo/axios/types/apiTypes';

const GET_SERVICES_ENDPOINT = '/services';

export const servicesApi = {
  async getServices(params: PrivateServiceQueryParams) {
    const res = await apiClient.get<BaseResponse<GetServiceResponse>>(GET_SERVICES_ENDPOINT, {
      params,
    });
    return res.data;
  },
  async deleteService(id: number) {
    const res = await apiClient.delete<BaseResponse<Record<string, never>>>(
      `${GET_SERVICES_ENDPOINT}/${id.toString()}`,
    );
    return res.data;
  },
};
