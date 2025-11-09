import { AuthResponse, BaseResponse, LoginRequest, RegisterRequest } from '../../types/apiTypes';
import { apiClient } from '../apiClient';

const LOGIN_ENDPOINT = '/sign-in';
const REGISTER_ENDPOINT = '/sign-up';
const LOGOUT_ENDPOINT = '/logout';

export type RegisterCustomRequest = Omit<RegisterRequest, 'name'> & {
  name?: string;
};

export const authApi = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(LOGIN_ENDPOINT, data);
    return response.data;
  },
  async register(data: RegisterCustomRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(REGISTER_ENDPOINT, data);
    return response.data;
  },
  async logout() {
    await apiClient.post(LOGOUT_ENDPOINT);
  },
};
