import {
  BaseResponse,
  DeleteMediaParams,
  GetMediaParams,
  GetMediaResponse,
  UploadMediaRequest,
  UploadMediaResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import { formDataUtils } from '../../utils/formDataUtils';

const MEDIA_ENDPOINT = '/media';

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
    });
    return res.data;
  },
  async deleteMedia(id: number, params: DeleteMediaParams) {
    const res = await apiClient.delete(`${MEDIA_ENDPOINT}/media/${id}`, { params });
    return res.data;
  },
};
