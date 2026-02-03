import {
  BaseResponse,
  MasterWithRelationsEntityResponse,
  CreateMasterRequest,
  GetMastersResponse,
  GetMastersQueryParams,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const MASTERS_ENDPOINT = '/masters/';

export const masterApi = {
  async getMastersInfo(params: GetMastersQueryParams) {
    const response = await apiClient.get<BaseResponse<GetMastersResponse>>(MASTERS_ENDPOINT, {
      params,
    });
    return response.data;
  },
  async createMaster(data: CreateMasterRequest) {
    const response = await apiClient.post<BaseResponse<MasterWithRelationsEntityResponse>>(
      MASTERS_ENDPOINT,
      data,
    );
    return response.data;
  },
  async updateMaster(id: number, data: CreateMasterRequest) {
    const response = await apiClient.put<BaseResponse<MasterWithRelationsEntityResponse>>(
      `${MASTERS_ENDPOINT}${id}`,
      data,
    );
    return response.data;
  },
  async deleteMaster(id: number) {
    const response = await apiClient.delete<BaseResponse<void>>(`${MASTERS_ENDPOINT}${id}`);
    return response.data;
  },
};
