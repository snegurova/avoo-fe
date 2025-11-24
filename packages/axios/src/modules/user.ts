import { BaseResponse, UserMediaResponse, UserProfileResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const UPDATE_AVATAR_ENDPOINT = '/update-avatar';
const GET_PROFILE_INFO_ENDPOINT = '/profile';
const GET_USER_MEDIA_ENDPOINT = '/media';

export type UpdateAvatarResponse = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  avatarPreviewUrl: string;
  isEmailVerify: boolean;
  phone: string;
};

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
  async updateAvatar(file: { uri: string; type?: string; name?: string }) {
    const formData = new FormData();

    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'avatar.jpg',
    } as any);

    const response = await apiClient.patch<BaseResponse<UpdateAvatarResponse>>(
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
