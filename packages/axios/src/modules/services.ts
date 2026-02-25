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
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((val) => {
              searchParams.append(key, String(val));
            });
          } else if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
        return searchParams.toString();
      },
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
