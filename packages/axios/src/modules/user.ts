import {
  BaseResponse,
  FileInput,
  UserMediaResponse,
  UserProfileResponse,
  UserUpdateAvatarResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const UPDATE_AVATAR_ENDPOINT = '/update-avatar';
const GET_PROFILE_INFO_ENDPOINT = '/profile';
const GET_USER_MEDIA_ENDPOINT = '/media';

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
  async updateAvatar(file: FileInput) {
    const formData = new FormData();

    formData.append('file', file);

    const response = await apiClient.patch<BaseResponse<UserUpdateAvatarResponse>>(
      UPDATE_AVATAR_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
};
