import { BaseResponse, MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const GET_MASTERS_INFO_ENDPOINT = '/masters';

export const masterApi = {
  async getMastersInfo() {
    const response =
      await apiClient.get<BaseResponse<MasterWithRelationsEntityResponse>>(
        GET_MASTERS_INFO_ENDPOINT,
      );
    return response.data;
  },
};
