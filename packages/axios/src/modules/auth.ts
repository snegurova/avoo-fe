import { LoginFormData } from '@avoo/hooks';
import { AuthResponse, BaseResponse, LoginRequest, RegisterRequest } from '../../types/apiTypes';
import { apiClient } from '../apiClient';



export type RegisterCustomRequest = Omit<RegisterRequest, 'name'> & {
  name?: string;
};


export type ForgotPasswordRequest = Omit<LoginRequest, 'password'>


export const authApi = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(`/sign-in`, data);
    return response.data;
  },
  async register(data: RegisterCustomRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(`/sign-up`, data);
    return response.data;
  },
  async forgotPassword(data: ForgotPasswordRequest) {
    const response = await apiClient.post<BaseResponse<{}>>(`/forgot-password`, data);
    return response.data;
  },
  async logout() {
    await apiClient.post(`/logout`);
  },
};
