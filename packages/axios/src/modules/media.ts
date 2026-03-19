import { apiClient } from '@avoo/axios';
import {
  BaseResponse,
  DeleteMediaParams,
  GetMediaParams,
  GetMediaResponse,
  GetPublicMediaParams,
  UploadMediaRequest,
  UploadMediaResponse,
} from '@avoo/axios/types/apiTypes';

import { formDataUtils } from '../../utils/formDataUtils';

const MEDIA_ENDPOINT = '/media';
const MEDIA_PUBLIC_ENDPOINT = '/public/media';

export const mediaApi = {
  async getMedia(params: GetMediaParams) {
    const response = await apiClient.get<BaseResponse<GetMediaResponse>>(MEDIA_ENDPOINT, {
      params,
    });
    return response.data;
  },
  async uploadMedia(data: UploadMediaRequest) {
    const formData = formDataUtils.getFileFormData(data);

    const res = await apiClient.post<BaseResponse<UploadMediaResponse>>(MEDIA_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60 * 1000,
    });
    return res.data;
  },
  async deleteMedia(id: number, params: DeleteMediaParams) {
    const res = await apiClient.delete(`${MEDIA_ENDPOINT}/media/${id}`, { params });
    return res.data;
  },
  async getPublicMedia(params: GetPublicMediaParams) {
    const response = await apiClient.get<BaseResponse<GetMediaResponse>>(MEDIA_PUBLIC_ENDPOINT, {
      params,
    });
    return response.data;
  },
};
