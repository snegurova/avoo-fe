import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';

export const queryKeys = {
  masters: {
    all: ['masters'] as const,
  },
  schedules: {
    all: ['schedules'] as const,
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
  monthCalendar: {
    all: ['monthCalendar'] as const,
    byParams: (params: PrivateCalendarQueryParams) =>
      [...queryKeys.monthCalendar.all, params] as const,
  },
} as const;
