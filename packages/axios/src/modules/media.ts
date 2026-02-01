import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const MEDIA_ENDPOINT = '/media';

export const mediaApi = {
  async uploadMedia() {
    const res = await apiClient.post<BaseResponse>(MEDIA_ENDPOINT);
    return res.data;
  },
};
