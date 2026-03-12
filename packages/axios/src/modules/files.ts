import { apiClient } from '@avoo/axios';
import { BaseResponse, FileUploadResponse } from '@avoo/axios/types/apiTypes';

const UPLOAD_FILE_ENDPOINT = '/files';

export const filesApi = {
  async uploadFile(body: FormData) {
    const response = await apiClient.post<BaseResponse<FileUploadResponse>>(
      UPLOAD_FILE_ENDPOINT,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
};
