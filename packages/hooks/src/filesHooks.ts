import { useMutation } from '@tanstack/react-query';
import { filesApi } from '@avoo/axios';
import { BaseResponse, FileUploadResponse, UploadFileRequest } from '@avoo/axios/types/apiTypes';
import { utils } from '../utils/utils';
import { ApiStatus } from '../types/apiTypes';

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
        body.append('type', payload.type);
        body.append('file', payload.file);
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
