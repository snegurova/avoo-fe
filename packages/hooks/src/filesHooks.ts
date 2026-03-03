import { filesApi } from '@avoo/axios';
import { BaseResponse, FileUploadResponse, UploadFileRequest } from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/axios/types/apiTypes';
import { formDataUtils } from '@avoo/axios/utils/formDataUtils';

import { useMutation } from '@tanstack/react-query';

import { utils } from '../utils/utils';

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
        const body = formDataUtils.getFileFormData(payload);

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
