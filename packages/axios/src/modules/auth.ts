import { LoginFormData } from '@avoo/hooks';
import { AuthResponse, BaseResponse, LoginRequest, RegisterRequest } from '../../types/apiTypes';
import { apiClient } from '../apiClient';

interface RegisterCustomRequest extends Omit<RegisterRequest, 'name'> {
  name: string | null;
}


export const authApi = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(`/sign-in`, data);
    return response.data;
  },
  async register(data: RegisterCustomRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(`/sign-up`, data);
    return response.data.data;
  },
  async logout() {
    await apiClient.post(`/logout`);
  },
};
