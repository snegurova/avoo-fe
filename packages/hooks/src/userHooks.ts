import { utils } from './../utils/utils';
import { userApi } from '@avoo/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BaseResponse,
  CertificateResponse,
  UserMediaResponse,
  UserProfileResponse,
  UserUpdateAvatarResponse,
} from '@avoo/axios/types/apiTypes';
import { FileInput } from '@avoo/shared';
import { apiStatus } from '../types/apiTypes';
import { queryKeys } from './queryKeys';
import { appendFileToForm, buildCertificateForm } from './utils/formDataHelpers';
import { CreateCertificatePayload } from '@avoo/axios/types/certificate';
import type { components } from '@avoo/axios/types/generated';

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
      location_lat: profileInfo?.businessInfo?.location_lat ?? null,
      location_lon: profileInfo?.businessInfo?.location_lon ?? null,
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

    const {
      mutate: handleUpdateAvatar,
      mutateAsync: handleUpdateAvatarAsync,
      isPending,
    } = useMutation<BaseResponse<UserUpdateAvatarResponse>, Error, FileInput>({
      mutationFn: async (file) => {
        const form = new FormData();
        await appendFileToForm(form, 'file', file);
        return userApi.updateAvatar(form);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      handleUpdateAvatar,
      handleUpdateAvatarAsync,
    };
  },
  usePostCertificate: () => {
    const queryClient = useQueryClient();

    const { mutate: handleAddCertificate, isPending } = useMutation<
      BaseResponse<CertificateResponse>,
      Error,
      CreateCertificatePayload
    >({
      mutationFn: (payload) => {
        return (async () => {
          const form = await buildCertificateForm(payload);
          return userApi.createCertificate(form);
        })();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
        queryClient.invalidateQueries({ queryKey: queryKeys.user.certificates() });
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      handleAddCertificate,
    };
  },
  useUpdateProfile: () => {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, isPending } = useMutation<
      BaseResponse<UserProfileResponse>,
      Error,
      Partial<components['schemas']['UpdateProfileDto']>
    >({
      mutationFn: (payload) => {
        return userApi.updateProfile(payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      handleUpdateProfile: mutate,
      handleUpdateProfileAsync: mutateAsync,
      isPending,
    };
  },
};
