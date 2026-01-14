import {
  BaseResponse,
  UserMediaResponse,
  UserProfileResponse,
  UserUpdateAvatarResponse,
  CertificateResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import { components } from '../../types/generated';

const UPDATE_AVATAR_ENDPOINT = '/update-avatar';
const PROFILE_ENDPOINT = '/profile';
const GET_USER_MEDIA_ENDPOINT = '/media';
const CERTIFICATES_ENDPOINT = '/certificates';

export const userApi = {
  async getUserProfile() {
    const response = await apiClient.get<BaseResponse<UserProfileResponse>>(PROFILE_ENDPOINT);
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

  async updateProfile(body: Partial<components['schemas']['UpdateProfileDto']>) {
    const response = await apiClient.put<BaseResponse<UserProfileResponse>>(PROFILE_ENDPOINT, body);
    return response.data;
  },
};
