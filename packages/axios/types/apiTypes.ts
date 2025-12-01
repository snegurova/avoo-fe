import type { components } from './generated';

export type Error = {
  field: string;
  message: string;
};
export type BaseResponse<T> = {
  status: string;
  errorMessage?: string;
  errors?: Error[];
  data: T | null;
};
export type Category = components['schemas']['CategoryEntity'];

/** Auth */
export type LoginRequest = components['schemas']['LoginRequestDto'];
export type RegisterRequest = components['schemas']['CreateUserDto'];
export type AuthResponse = components['schemas']['UserResponseDto'];
export type ForgotPasswordRequest = components['schemas']['LoginRequestDto'];
export type VerifyCodeRequest = components['schemas']['AuthWithCodeRequestDto'];
export type VerifyCodeResponse = components['schemas']['UserResponseDto'];
export type ResetPasswordRequest = components['schemas']['ResetPasswordRequestDto'];
export type ResetPasswordResponse = components['schemas']['UserResponseDto'];

/** User */
export type UserProfileResponse = components['schemas']['UserProfileEntity'];
export type UserMediaResponse = {
  items: components['schemas']['MediaEntity'][];
  pagination: components['schemas']['PaginationDto'];
};

export type UploadFile = {
  uri: string;
  type?: string | null;
  name?: string | null;
};

export type FileInput = File | UploadFile;
export type UserUpdateAvatarResponse = components['schemas']['UserEntity'];

/** Master */
export type MasterWithRelationsEntityResponse = components['schemas']['MasterEntity'][];

/** Schedule */
export type GetSchedulesResponse = {
  items: components['schemas']['ScheduleEntity'][];
  pagination: components['schemas']['PaginationDto'];
};

/** Calendar */
export type GetCalendarResponse = {
  items: components['schemas']['PrivateCalendarResponseDto'][];
  pagination: components['schemas']['PaginationDto'];
};
