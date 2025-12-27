import {
  BaseResponse,
  MasterWithRelationsEntityResponse,
  CreateMasterRequest,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const GET_MASTERS_INFO_ENDPOINT = '/masters';
const CREATE_MASTER_ENDPOINT = '/masters';

export const masterApi = {
  async getMastersInfo() {
    const response =
      await apiClient.get<BaseResponse<MasterWithRelationsEntityResponse[]>>(
        GET_MASTERS_INFO_ENDPOINT,
      );
    return response.data;
  },
  async createMaster(data: CreateMasterRequest) {
    const response = await apiClient.post<BaseResponse<MasterWithRelationsEntityResponse>>(
      CREATE_MASTER_ENDPOINT,
      data,
    );
    return response.data;
  },
};
