import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { userApi } from '@avoo/axios';
import {
  ApiStatus,
  BaseResponse,
  CertificateResponse,
  FileEntity,
  GetPublicCertificatesQueryParams,
  GetPublicCertificatesResponse,
  GetPublicUserProfileResponse,
  GetPublicUsersResponse,
  UpdateProfile,
  UserMediaResponse,
  UserProfileResponse,
  UserUpdateAvatarResponse,
} from '@avoo/axios/types/apiTypes';
import { CreateCertificatePayload } from '@avoo/axios/types/certificate';
import { MediaType } from '@avoo/hooks/types/mediaType';
import { FileInput } from '@avoo/shared';

import { utils } from './../utils/utils';
import { appendFileToForm, buildCertificateForm } from './utils/formDataHelpers';
import { queryKeys } from './queryKeys';

const DEFAULT_CERTIFICATES_LIMIT = 6;

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

    const profileInfo = userProfileData?.status === ApiStatus.SUCCESS ? userProfileData.data : null;

    const visualProfileInfo = {
      name: profileInfo?.businessInfo?.name ?? null,
      headline: profileInfo?.businessInfo?.headline ?? null,
      description: profileInfo?.businessInfo?.description ?? null,
      address: profileInfo?.businessInfo?.address ?? null,
      email: profileInfo?.email ?? null,
      phone: profileInfo?.businessInfo?.phone ?? null,
      policy: profileInfo?.businessInfo?.policy ?? null,
      avatarUrl:
        profileInfo?.avatarUrl ??
        profileInfo?.businessInfo?.avatarUrl ??
        profileInfo?.avatarPreviewUrl ??
        null,
      avatarPreviewUrl: profileInfo?.avatarPreviewUrl ?? null,
      languages: profileInfo?.businessInfo?.languages ?? null,
      location_lat: profileInfo?.businessInfo?.location_lat ?? null,
      location_lon: profileInfo?.businessInfo?.location_lon ?? null,
    };

    const visualLanguages = profileInfo?.businessInfo?.languages ?? null;

    return {
      visualProfileInfo,
      visualLanguages,
      userId: profileInfo?.id ?? null,
    };
  },
  useGetUserMedia: () => {
    const { userId } = userHooks.useGetUserProfile();

    const { data: userMediaData, isPending } = useQuery<BaseResponse<UserMediaResponse>, Error>({
      queryKey: queryKeys.user.media(),
      queryFn: () => {
        if (!userId) throw new Error('userId is required');
        return userApi.getUserMedia(MediaType.USER, userId);
      },
      enabled: !!userId,
    });

    utils.useSetPendingApi(isPending);

    if (userMediaData?.status === ApiStatus.SUCCESS) {
      return userMediaData.data;
    }

    return null;
  },
  useGetUserCertificates: () => {
    const { data: certificatesData, isPending } = useQuery<
      BaseResponse<{ items: CertificateResponse[] }>,
      Error
    >({
      queryKey: queryKeys.user.certificates(),
      queryFn: userApi.getCertificates,
    });

    utils.useSetPendingApi(isPending);

    if (certificatesData?.status === ApiStatus.SUCCESS) {
      return certificatesData.data;
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
      UpdateProfile
    >({
      mutationFn: (payload) => {
        return userApi.updateProfile(payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      handleUpdateProfile: mutate,
      handleUpdateProfileAsync: mutateAsync,
      isPending,
    };
  },
  useUpdateProfileAvatar: () => {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, isPending } = useMutation<
      BaseResponse<UserProfileResponse>,
      Error,
      FileEntity
    >({
      mutationFn: (payload) => {
        const updateProfilePayload: UpdateProfile = {
          avatarUrl: payload.url,
          avatarPreviewUrl: payload.previewUrl,
        };
        return userApi.updateProfile(updateProfilePayload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      handleUpdateProfileAvatar: mutate,
      handleUpdateProfileAvatarAsync: mutateAsync,
      isPending,
    };
  },
  useGetPublicUsers: () => {
    const { data: publicUsersData, isPending } = useQuery<
      BaseResponse<GetPublicUsersResponse>,
      Error
    >({
      queryKey: queryKeys.user.all,
      queryFn: userApi.getPublicUsers,
    });

    utils.useSetPendingApi(isPending);

    if (publicUsersData?.status === ApiStatus.SUCCESS) {
      return publicUsersData.data;
    }

    return null;
  },
  useGetPublicUser: (userId: number) => {
    const { data: publicUserData, isPending } = useQuery<
      BaseResponse<GetPublicUserProfileResponse>,
      Error
    >({
      queryKey: queryKeys.users.byId(userId),
      queryFn: () => userApi.getPublicUser(userId),
      enabled: !!userId,
    });

    utils.useSetPendingApi(isPending);

    if (publicUserData?.status === ApiStatus.SUCCESS) {
      return publicUserData.data;
    }

    return null;
  },
  useGetPublicCertificatesInfinite: (params: GetPublicCertificatesQueryParams) => {
    const query = useInfiniteQuery<BaseResponse<GetPublicCertificatesResponse>, Error>({
      queryKey: queryKeys.user.publicCertificates(params),
      queryFn: ({ pageParam = 1 }) =>
        userApi.getPublicCertificates({ ...params, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * (params?.limit || DEFAULT_CERTIFICATES_LIMIT) < total
          ? currentPage + 1
          : undefined;
      },
    });

    const isPending = query.isFetching;

    utils.useSetPendingApi(isPending);

    return query;
  },
};
