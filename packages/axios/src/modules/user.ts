import { apiClient } from '@avoo/axios';
import {
  BaseResponse,
  CertificateResponse,
  GetPublicUserProfileResponse,
  GetPublicUsersResponse,
  UpdateProfile,
  UserMediaResponse,
  UserProfileResponse,
  UserUpdateAvatarResponse,
} from '@avoo/axios/types/apiTypes';
import { MediaType } from '@avoo/hooks/types/mediaType';

const UPDATE_AVATAR_ENDPOINT = '/update-avatar';
const PROFILE_ENDPOINT = '/profile';
const GET_USER_MEDIA_ENDPOINT = '/media';
const CERTIFICATES_ENDPOINT = '/certificates';
const PUBLIC_USERS_ENDPOINT = '/public/users';

export const userApi = {
  async getUserProfile() {
    const response = await apiClient.get<BaseResponse<UserProfileResponse>>(PROFILE_ENDPOINT);
    return response.data;
  },
  async getUserMedia(type: MediaType, typeEntityId: number, page?: number, limit?: number) {
    const response = await apiClient.get<BaseResponse<UserMediaResponse>>(GET_USER_MEDIA_ENDPOINT, {
      params: { type, typeEntityId, ...(page ? { page } : {}), ...(limit ? { limit } : {}) },
    });
    return response.data;
  },
  async updateAvatar(body: FormData) {
    const response = await apiClient.patch<BaseResponse<UserUpdateAvatarResponse>>(
      UPDATE_AVATAR_ENDPOINT,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
  async createCertificate(body: FormData) {
    const response = await apiClient.post<BaseResponse<CertificateResponse>>(
      CERTIFICATES_ENDPOINT,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  async getCertificates() {
    const response =
      await apiClient.get<
        BaseResponse<{ items: CertificateResponse[]; pagination?: { total?: number } }>
      >(CERTIFICATES_ENDPOINT);

    return response.data;
  },

  async updateProfile(body: UpdateProfile) {
    const response = await apiClient.put<BaseResponse<UserProfileResponse>>(PROFILE_ENDPOINT, body);
    return response.data;
  },

  async getPublicUsers() {
    const response =
      await apiClient.get<BaseResponse<GetPublicUsersResponse>>(PUBLIC_USERS_ENDPOINT);
    return response.data;
  },
  async getPublicUser(userId: number) {
    const response = await apiClient.get<BaseResponse<GetPublicUserProfileResponse>>(
      `${PUBLIC_USERS_ENDPOINT}/${userId}`,
    );
    return response.data;
  },
};
