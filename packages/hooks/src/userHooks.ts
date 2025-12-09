import { utils } from './../utils/utils';
import { userApi } from '@avoo/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BaseResponse,
  FileInput,
  UserMediaResponse,
  UserProfileResponse,
  UserUpdateAvatarResponse,
} from '@avoo/axios/types/apiTypes';
import { apiStatus } from '../types/apiTypes';
import { queryKeys } from './queryKeys';

export const userHooks = {
  useGetUserProfile: () => {
    const { data: userProfileData, isPending } = useQuery<BaseResponse<UserProfileResponse>, Error>(
      {
        queryKey: queryKeys.user.profile(),
        queryFn: userApi.getUserProfile,
        refetchOnMount: true,
      },
    );

    utils.useSetPendingApi(isPending);

    const profileInfo = userProfileData?.status === apiStatus.SUCCESS ? userProfileData.data : null;

    const visualProfileInfo = {
      name: profileInfo?.businessInfo?.name ?? 'Salon Name not set',
      description: profileInfo?.businessInfo?.description ?? 'Some description about the salon',
      address: profileInfo?.businessInfo?.address ?? 'Salon address not set',
      email: profileInfo?.email ?? 'Email not set',
      phone: profileInfo?.businessInfo?.phone ?? 'Phone not set',
      avatarUrl: profileInfo?.avatarPreviewUrl ?? profileInfo?.avatarUrl ?? null,
      avatarPreviewUrl: profileInfo?.avatarPreviewUrl ?? null,
    };

    const visualLanguages = profileInfo?.businessInfo?.languages ?? null;

    return {
      visualProfileInfo,
      visualLanguages,
    };
  },
  useGetUserMedia: () => {
    const { data: userMediaData, isPending } = useQuery<BaseResponse<UserMediaResponse>, Error>({
      queryKey: queryKeys.user.media(),
      queryFn: userApi.getUserMedia,
    });

    utils.useSetPendingApi(isPending);

    if (userMediaData?.status === apiStatus.SUCCESS) {
      return userMediaData.data;
    }

    return null;
  },
  usePatchUserProfileAvatar: () => {
    const queryClient = useQueryClient();

    const { mutate: handleUpdateAvatar, isPending } = useMutation<
      BaseResponse<UserUpdateAvatarResponse>,
      Error,
      FileInput
    >({
      mutationFn: userApi.updateAvatar,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      handleUpdateAvatar,
    };
  },
};
