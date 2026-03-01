import { utils } from '@avoo/hooks/utils/utils';
import { calendarApi } from '@avoo/axios';

import {
  BaseResponse,
  GetCalendarResponse,
  GetCalendarByDatesResponse,
  PrivateCalendarByDatesQueryParams,
  PrivateCalendarQueryParams,
  ApiStatus,
  GetPublicCalendarResponse,
  GetPublicCalendarByDatesResponse,
  PublicCalendarQueryParams,
  PublicCalendarByDatesQueryParams,
} from '@avoo/axios/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from './queryKeys';

export const calendarHooks = {
  useGetCalendar: (params: PrivateCalendarQueryParams, options?: { enabled?: boolean }) => {
    const memoParams = useMemo<PrivateCalendarQueryParams>(() => params, [params]);

    const {
      data: calendarData,
      isPending,
      refetch,
    } = useQuery<BaseResponse<GetCalendarResponse>, Error>({
      queryKey: ['calendar', queryKeys.calendar.byParams(memoParams)],
      queryFn: () => calendarApi.getCalendar(memoParams),
      enabled: options?.enabled ?? true,
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === ApiStatus.SUCCESS && calendarData.data) {
      return { data: calendarData.data, refetch };
    }

    return { data: null, refetch };
  },
  useGetCalendarByDates: (params: PrivateCalendarQueryParams) => {
    const memoParams = useMemo<PrivateCalendarByDatesQueryParams>(() => params, [params]);

    const {
      data: calendarData,
      isPending,
      refetch,
    } = useQuery<BaseResponse<GetCalendarByDatesResponse>, Error>({
      queryKey: ['monthCalendar', queryKeys.monthCalendar.byParams(memoParams)],
      queryFn: () => calendarApi.getCalendarByDates(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === ApiStatus.SUCCESS && calendarData.data) {
      return { data: calendarData.data, refetch };
    }

    return { data: null, refetch };
  },
  useGetPublicCalendar: (params: PublicCalendarQueryParams, options?: { enabled?: boolean }) => {
    const memoParams = useMemo<PublicCalendarQueryParams>(() => params, [params]);

    const {
      data: calendarData,
      isPending,
      refetch,
    } = useQuery<BaseResponse<GetPublicCalendarResponse>, Error>({
      queryKey: ['publicCalendar', queryKeys.publicCalendar.byParams(memoParams)],
      queryFn: () => calendarApi.getPublicCalendar(memoParams),
      enabled: options?.enabled ?? true,
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === ApiStatus.SUCCESS && calendarData.data) {
      return { data: calendarData.data, refetch };
    }

    return { data: null, refetch };
  },
  useGetPublicCalendarByDates: (params: PublicCalendarByDatesQueryParams) => {
    const memoParams = useMemo<PublicCalendarByDatesQueryParams>(() => params, [params]);

    const {
      data: calendarData,
      isPending,
      refetch,
    } = useQuery<BaseResponse<GetPublicCalendarByDatesResponse>, Error>({
      queryKey: ['publicMonthCalendar', queryKeys.publicMonthCalendar.byParams(memoParams)],
      queryFn: () => calendarApi.getPublicCalendarByDates(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === ApiStatus.SUCCESS && calendarData.data) {
      return { data: calendarData.data, refetch };
    }

    return { data: null, refetch };
  },
};
