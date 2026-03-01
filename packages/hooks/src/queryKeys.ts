import {
  PrivateCalendarQueryParams,
  PrivateServiceQueryParams,
  PrivateOrderQueryParams,
  GetCustomersQueryParams,
  GetMastersQueryParams,
  GetCombinationsQueryParams,
  GetExceptionsQueryParams,
  PublicCalendarQueryParams,
  PublicCalendarByDatesQueryParams,
} from '@avoo/axios/types/apiTypes';

export const queryKeys = {
  masters: {
    all: ['masters'] as const,
    byParams: (params: GetMastersQueryParams) => [...queryKeys.masters.all, params] as const,
    infinite: ['mastersInfinite'] as const,
    public: ['publicMasters'] as const,
  },
  schedules: {
    all: ['schedules'] as const,
  },
  services: {
    all: ['services'] as const,
    public: ['publicServices'] as const,
    byParams: (params: PrivateServiceQueryParams) => [...queryKeys.services.all, params] as const,
  },
  categories: {
    all: ['categories'] as const,
    byParams: (params: string) => [...queryKeys.categories.all, params] as const,
  },
  customers: {
    all: ['customers'] as const,
    byParams: (params: GetCustomersQueryParams) => [...queryKeys.customers.all, params] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    certificates: () => [...queryKeys.user.all, 'certificates'] as const,
    media: () => [...queryKeys.user.all, 'media'] as const,
  },
  calendar: {
    all: ['calendar'] as const,
    byParams: (params: PrivateCalendarQueryParams) => [...queryKeys.calendar.all, params] as const,
  },
  publicCalendar: {
    all: ['publicCalendar'] as const,
    byParams: (params: PublicCalendarQueryParams) =>
      [...queryKeys.publicCalendar.all, params] as const,
  },
  monthCalendar: {
    all: ['monthCalendar'] as const,
    byParams: (params: PrivateCalendarQueryParams) =>
      [...queryKeys.monthCalendar.all, params] as const,
  },
  publicMonthCalendar: {
    all: ['publicMonthCalendar'] as const,
    byParams: (params: PublicCalendarByDatesQueryParams) =>
      [...queryKeys.publicMonthCalendar.all, params] as const,
  },
  exceptions: {
    all: ['exceptions'] as const,
    byParams: (params: GetExceptionsQueryParams) => [...queryKeys.exceptions.all, params] as const,
  },
  orders: {
    all: ['orders'] as const,
    byId: (id: number) => [...queryKeys.orders.all, id] as const,
    byParams: (params: PrivateOrderQueryParams) => [...queryKeys.orders.all, params] as const,
  },
  combinations: {
    all: ['combinations'] as const,
    public: ['publicCombinations'] as const,
    byParams: (params: GetCombinationsQueryParams) =>
      [...queryKeys.combinations.all, params] as const,
  },
} as const;
