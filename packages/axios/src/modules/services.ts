import {
  BaseResponse,
  CreateServiceRequest,
  CreateServiceResponse,
  GetServiceResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import { PrivateServiceQueryParams } from '@avoo/axios/types/apiTypes';

const SERVICES_ENDPOINT = '/services';

export const servicesApi = {
  async getServices(params: PrivateServiceQueryParams) {
    const res = await apiClient.get<BaseResponse<GetServiceResponse>>(SERVICES_ENDPOINT, {
      params,
    });
    return res.data;
  },
  async deleteService(id: number) {
    const res = await apiClient.delete<BaseResponse<Record<string, never>>>(
      `${SERVICES_ENDPOINT}/${id.toString()}`,
    );
    return res.data;
  },
  async createService(data: CreateServiceRequest) {
    const res = await apiClient.post<BaseResponse<CreateServiceResponse>>(SERVICES_ENDPOINT, data);
    return res.data;
  },
};
