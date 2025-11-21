import { AuthResponse, BaseResponse, LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyCodeRequest, VerifyCodeResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const LOGIN_ENDPOINT = '/sign-in';
const REGISTER_ENDPOINT = '/sign-up';
const LOGOUT_ENDPOINT = '/logout';
const FORGOT_PASSWORD_ENDPOINT = '/forgot-password';
const VERIFY_CODE_ENDPOINT = '/reset-password/code';
const RESET_PASSWORD_ENDPOINT = '/reset-password';


export type RegisterCustomRequest = Omit<RegisterRequest, 'name'> & {
  name?: string;
};

export type ForgotPasswordRequest = Omit<LoginRequest, 'password'>



export const authApi = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(LOGIN_ENDPOINT, data);
    return response.data;
  },
  async register(data: RegisterCustomRequest) {
    const response = await apiClient.post<BaseResponse<AuthResponse>>(REGISTER_ENDPOINT, data);
    return response.data;
  },
  async forgotPassword(data: ForgotPasswordRequest) {
    const response = await apiClient.post<BaseResponse<Record<string, never>>>(FORGOT_PASSWORD_ENDPOINT, data);
    return response.data;
  },
  async verifyCode(data: VerifyCodeRequest) {
    const response = await apiClient.post<BaseResponse<VerifyCodeResponse>>(VERIFY_CODE_ENDPOINT, data);
    return response.data;
  },
  async resetPassword(data: ResetPasswordRequest) {
    const response = await apiClient.post<BaseResponse<Record<string, never>>>(RESET_PASSWORD_ENDPOINT, data);
    return response.data;
  },
  async logout() {
    await apiClient.post(LOGOUT_ENDPOINT);
  },
};
