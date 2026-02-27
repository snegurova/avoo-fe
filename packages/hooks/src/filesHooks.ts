import { useMutation } from '@tanstack/react-query';
import { filesApi } from '@avoo/axios';
import { BaseResponse, FileUploadResponse, UploadFileRequest } from '@avoo/axios/types/apiTypes';
import { utils } from '../utils/utils';
import { ApiStatus } from '@avoo/axios/types/apiTypes';

type UseUploadFileParams = {
  onSuccess?: (data: FileUploadResponse) => void;
};

export const filesHooks = {
  useUploadFile: ({ onSuccess }: UseUploadFileParams = {}) => {
    const { mutate, isPending } = useMutation<
      BaseResponse<FileUploadResponse>,
      Error,
      UploadFileRequest
    >({
      mutationFn: async (payload) => {
        const body = new FormData();
        if (typeof Blob !== 'undefined' && payload.file instanceof Blob) {
          if (typeof File !== 'undefined' && payload.file instanceof File) {
            body.append('file', payload.file, payload.file.name);
          } else {
            body.append('file', payload.file);
          }
        } else {
          body.append('file', payload.file as unknown as Blob);
        }
        body.append('type', payload.type);
        return filesApi.uploadFile(body);
      },
      onSuccess: (response) => {
        if (response?.status === ApiStatus.SUCCESS && response?.data) {
          onSuccess?.(response.data);
        }
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      uploadFile: mutate,
      isPending,
    };
  },
};
