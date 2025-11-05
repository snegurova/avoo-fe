import { LoginFormData } from '@avoo/hooks';
import { AuthResponse, BaseResponse, LoginRequest, RegisterRequest } from '../../types/apiTypes';
import { apiClient } from '../apiClient';



export type RegisterCustomRequest = Omit<RegisterRequest, 'name'> & {
  name?: string; // Замени string на нужный тип
};

export const authApi = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(`/sign-in`, data);
    return response.data;
  },
  async register(data: RegisterCustomRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(`/sign-up`, data);
    return response.data;
  },
  async logout() {
    await apiClient.post(`/logout`);
  },
};
