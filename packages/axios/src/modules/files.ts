import { BaseResponse, FileUploadResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const UPLOAD_FILE_ENDPOINT = '/files';

export const filesApi = {
  async uploadFile(body: FormData) {
    const response = await apiClient.post<BaseResponse<FileUploadResponse>>(UPLOAD_FILE_ENDPOINT, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
