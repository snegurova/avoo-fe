import {
  BaseResponse,
  UserMediaResponse,
  UserProfileResponse,
  UserUpdateAvatarResponse,
  CertificateResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const UPDATE_AVATAR_ENDPOINT = '/update-avatar';
const GET_PROFILE_INFO_ENDPOINT = '/profile';
const GET_USER_MEDIA_ENDPOINT = '/media';
const CERTIFICATES_ENDPOINT = '/certificates';

export const userApi = {
  async getUserProfile() {
    const response =
      await apiClient.get<BaseResponse<UserProfileResponse>>(GET_PROFILE_INFO_ENDPOINT);
    return response.data;
  },
  async getUserMedia() {
    const response = await apiClient.get<BaseResponse<UserMediaResponse>>(GET_USER_MEDIA_ENDPOINT);
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
};
