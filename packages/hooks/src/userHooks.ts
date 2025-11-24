import { utils } from './../utils/utils';
import { userApi } from '@avoo/axios';
import { useQuery } from '@tanstack/react-query';

import { BaseResponse, UserMediaResponse, UserProfileResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '../types/apiTypes';

export const userHooks = {
  useGetUserProfile: () => {
    const { data: userProfileData, isPending } = useQuery<BaseResponse<UserProfileResponse>, Error>(
      {
        queryKey: ['userProfile'],
        queryFn: userApi.getUserProfile,
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
    };

    const visualLanguages = profileInfo?.businessInfo?.languages ?? null;

    return {
      visualProfileInfo,
      visualLanguages,
    };
  },
  useGetUserMedia: () => {
    const { data: userMediaData, isPending } = useQuery<BaseResponse<UserMediaResponse>, Error>({
      queryKey: ['userMedia'],
      queryFn: userApi.getUserMedia,
    });

    utils.useSetPendingApi(isPending);

    if (userMediaData?.status === apiStatus.SUCCESS) {
      return userMediaData.data;
    }

    return null;
  },
};
