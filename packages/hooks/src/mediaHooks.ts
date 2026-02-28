import { mediaApi } from '@avoo/axios/src/modules/media';
import {
  BaseResponse,
  DeleteMediaParams,
  GetMediaResponse,
  MediaQueryParams,
  UploadMediaRequest,
  UploadMediaResponse,
} from '@avoo/axios/types/apiTypes';
import { utils } from '@avoo/hooks/utils/utils';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

const DEFAULT_LIMIT = 10;

type UseUploadMediaParams = {
  onSuccess?: (data: UploadMediaResponse) => void;
  onError?: (error: Error) => void;
};

export const mediaHooks = {
  useGetMediaInfinite: ({ limit = DEFAULT_LIMIT, type, typeEntityId }: MediaQueryParams) => {
    const filterParams = { limit, type, typeEntityId };
    const query = useInfiniteQuery<BaseResponse<GetMediaResponse>, Error>({
      queryKey: ['media', 'list', filterParams],
      queryFn: ({ pageParam = 1 }) =>
        mediaApi.getMedia({ ...filterParams, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * limit < total ? currentPage + 1 : undefined;
      },
    });

    const isPending = query.isFetching;

    utils.useSetPendingApi(isPending);

    return query;
  },

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
  useDeleteMedia: (params?: {
    onSuccess?: (mediaId: number) => void;
    onError?: (error: Error) => void;
  }) => {
    const queryClient = useQueryClient();

    const deleteMediaMutation = useMutation({
      mutationFn: (data: { mediaId: number; params: DeleteMediaParams }) => {
        return mediaApi.deleteMedia(data.mediaId, data.params);
      },

      onSuccess: (_, data) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.medias.all,
        });
        params?.onSuccess?.(data.mediaId);
      },

      onError: (error) => {
        params?.onError?.(error as Error);
      },
    });

    utils.useSetPendingApi(deleteMediaMutation.isPending);

    return {
      deleteMedia: deleteMediaMutation.mutate,
      deleteMediaAsync: deleteMediaMutation.mutateAsync,
      ...deleteMediaMutation,
    };
  },
};
