import { BaseResponse, UploadMediaRequest, UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const MEDIA_ENDPOINT = '/media';

export const mediaApi = {
  async uploadMedia(data: UploadMediaRequest) {
    const formData = new FormData();

    const file = data.file;

    if (typeof Blob !== 'undefined' && file instanceof Blob) {
      if (typeof File !== 'undefined' && file instanceof File) {
        formData.append('file', file, file.name);
      } else {
        formData.append('file', file);
      }
    } else {
      formData.append('file', file as unknown as Blob);
    }

    formData.append('type', data.type);
    const res = await apiClient.post<BaseResponse<UploadMediaResponse>>(MEDIA_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
