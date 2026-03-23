import { apiClient } from '@avoo/axios';
import { BaseResponse, FileUploadResponse, UploadFileRequest } from '@avoo/axios/types/apiTypes';

import { formDataUtils } from '../../utils/formDataUtils';

const UPLOAD_FILE_ENDPOINT = '/files';

export const filesApi = {
  async uploadFile(data: UploadFileRequest) {
    const formData = formDataUtils.getFileFormData(data);

    const res = await apiClient.post<BaseResponse<FileUploadResponse>>(
      UPLOAD_FILE_ENDPOINT,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60 * 1000,
      },
    );
    return res.data;
  },
};
