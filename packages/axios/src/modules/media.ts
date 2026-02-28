import { BaseResponse, UploadMediaRequest, UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import { formDataUtils } from '../../utils/formDataUtils';

const MEDIA_ENDPOINT = '/media';

export const mediaApi = {
  async uploadMedia(data: UploadMediaRequest) {
    const formData = formDataUtils.getFileFormData(data);

    const res = await apiClient.post<BaseResponse<UploadMediaResponse>>(MEDIA_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
