import { utils } from './../utils/utils';

import { userApi } from '@avoo/axios';
import { useQuery } from '@tanstack/react-query';

import { BaseResponse, UserMediaResponse, UserProfileResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '../constants/constants';

export const userHooks = {
  useGetUserProfile: () => {
    const { data: userProfileData, isPending } = useQuery<BaseResponse<UserProfileResponse>, Error>(
      {
        queryKey: ['userProfile'],
        queryFn: userApi.getUserProfile,
      },
    );

    utils.useSetPendingApi(isPending);

    if (userProfileData?.status === apiStatus.SUCCESS) {
      return userProfileData.data;
    }
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
  },
};
