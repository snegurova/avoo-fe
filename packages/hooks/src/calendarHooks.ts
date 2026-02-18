import { utils } from '@avoo/hooks/utils/utils';
import { calendarApi } from '@avoo/axios';

import {
  BaseResponse,
  GetCalendarResponse,
  GetCalendarByDatesResponse,
  PrivateCalendarByDatesQueryParams,
  PrivateCalendarQueryParams,
} from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from './queryKeys';

export const calendarHooks = {
  useGetCalendar: (params: PrivateCalendarQueryParams, options?: { enabled?: boolean }) => {
    const {
      masterIds,
      view,
      rangeFromDate,
      rangeToDate,
      serviceId,
      combinationId,
      orderStatuses,
      orderIsOutOfSchedule,
    } = params;
    const memoParams = useMemo<PrivateCalendarQueryParams>(
      () => ({
        masterIds,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
        orderStatuses,
        orderIsOutOfSchedule,
      }),
      [
        masterIds,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
        orderStatuses,
        orderIsOutOfSchedule,
      ],
    );

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
  useGetCalendarByDates: ({
    masterIds,
    view,
    rangeFromDate,
    rangeToDate,
    serviceId,
    combinationId,
    orderStatuses,
    orderIsOutOfSchedule,
  }: PrivateCalendarQueryParams) => {
    const memoParams = useMemo<PrivateCalendarByDatesQueryParams>(
      () => ({
        masterIds,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
        orderStatuses,
        orderIsOutOfSchedule,
      }),
      [
        masterIds,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
        orderStatuses,
        orderIsOutOfSchedule,
      ],
    );

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
};
