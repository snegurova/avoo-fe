import { UploadFileRequest, UploadMediaRequest } from '../types/apiTypes';

export const formDataUtils = ({
  getFileFormData(payload: UploadMediaRequest | UploadFileRequest) {
    const formData = new FormData();

    const file = payload.file;

    if (typeof Blob !== 'undefined' && file instanceof Blob) {
      if (typeof File !== 'undefined' && file instanceof File) {
        formData.append('file', file, file.name);
      } else {
        formData.append('file', file);
      }
    } else {
      formData.append('file', file as unknown as Blob);
    }

    formData.append('type', payload.type);
    return formData;
  },
})