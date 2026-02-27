import { mediaApi } from '@avoo/axios/src/modules/media';
import { ApiStatus, BaseResponse, UploadMediaRequest, UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import { utils } from '@avoo/hooks/utils/utils';
import { useMutation } from '@tanstack/react-query';

type UseUploadMediaParams = {
  onSuccess?: (data: UploadMediaResponse) => void;
  onError?: (error: Error) => void;
};

export const mediaHooks = {
  useUploadMedia: ({ onSuccess, onError }: UseUploadMediaParams = {}) => {
    const { mutate, isPending } = useMutation<
      BaseResponse<UploadMediaResponse>,
      Error,
      UploadMediaRequest
    >({
      mutationFn: mediaApi.uploadMedia,
      meta: {
        successMessage: 'Media uploaded successfully',
      },
      onSuccess: (data) => {
        if (data.status !== ApiStatus.SUCCESS || !data.data) return;
        onSuccess?.(data.data);
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      uploadMedia: mutate,
      isUploading: isPending,
    };
  },
};
