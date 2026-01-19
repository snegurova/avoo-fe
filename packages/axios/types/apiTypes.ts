import type { components, operations } from './generated';

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
/** Category && Services */
export type Category = components['schemas']['CategoryEntity'];
export type CategoryWithServicesCount = components['schemas']['ServiceWithCategoryDto'];
export type Service = components['schemas']['ServiceEntity'];
export type PrivateServiceQueryParams = components['schemas']['QueryServicesDto'];
export type GetServiceResponse = {
  items: Service[];
  pagination: components['schemas']['PaginationDto'];
};

export type GetCategoriesResponse = Category[];
export type GetPrivateCategoriesResponse =
  components['schemas']['ServicesGroupByCategoriesResponseDto'];
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

export type UserUpdateAvatarResponse = components['schemas']['UserEntity'];

export type CertificateResponse = components['schemas']['CertificateEntity'];

/** Master */
export type MasterWithRelationsEntityResponse = components['schemas']['MasterEntity'];

type MasterBaseForCreate = Omit<
  components['schemas']['MasterEntity'],
  'id' | 'avatarUrl' | 'avatarPreviewUrl'
>;
export type CreateMasterRequest = {
  email: MasterBaseForCreate['email'];
} & Partial<Omit<MasterBaseForCreate, 'email'>>;

export type MasterLanguages = components['schemas']['MasterEntity']['languages'];

export type MasterWithRelationsEntity = components['schemas']['MasterEntity'];

/** Schedule */
export type GetSchedulesResponse = {
  items: components['schemas']['ScheduleEntity'][];
  pagination: components['schemas']['PaginationDto'];
};

/** Calendar */
export type GetCalendarResponse = components['schemas']['PrivateCalendarResponseDto'][];

export type GetCalendarByDatesResponse = components['schemas']['PrivateCalendarResponseByDatesDto'];

export type CalendarItem = components['schemas']['PrivateCalendarResponseDto'];

export type PrivateEvent = components['schemas']['PrivateEventDto'];

export enum CalendarView {
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export type PrivateCalendarByDatesQueryParams =
  components['schemas']['QueryCalendarByDatesPrivateDto'];

export type PrivateCalendarQueryParams = Omit<
  operations['CalendarController_getCalendar']['parameters']['query'],
  'view'
> & { view?: CalendarView };

/** File types - re-exported from @avoo/shared for backward compatibility */
export type { FileInput, UploadFile } from '@avoo/shared';
