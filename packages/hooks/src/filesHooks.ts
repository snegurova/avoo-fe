import { useMutation } from '@tanstack/react-query';

import { filesApi } from '@avoo/axios';
import { BaseResponse, FileUploadResponse, UploadFileRequest } from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/axios/types/apiTypes';

import { utils } from '../utils/utils';

type UseUploadFileParams = {
  onSuccess?: (data: FileUploadResponse) => void;
  onError?: (error: Error) => void;
};

export const filesHooks = {
  useUploadFile: ({ onSuccess, onError }: UseUploadFileParams = {}) => {
    const { mutate, isPending } = useMutation<
      BaseResponse<FileUploadResponse>,
      Error,
      UploadFileRequest
    >({
      mutationFn: filesApi.uploadFile,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) onSuccess?.(response.data);
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      uploadFile: mutate,
      isPending,
    };
  },
};
