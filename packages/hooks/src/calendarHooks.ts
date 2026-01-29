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
  useGetCalendar: ({
    masterIds,
    view,
    rangeFromDate,
    rangeToDate,
    serviceId,
    combinationId,
    orderStatus,
  }: PrivateCalendarQueryParams) => {
    const memoParams = useMemo<PrivateCalendarQueryParams>(
      () => ({
        masterIds,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
        orderStatus,
      }),
      [masterIds, view, rangeFromDate, rangeToDate, serviceId, combinationId, orderStatus],
    );

    const { data: calendarData, isPending } = useQuery<BaseResponse<GetCalendarResponse>, Error>({
      queryKey: ['calendar', queryKeys.calendar.byParams(memoParams)],
      queryFn: () => calendarApi.getCalendar(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === ApiStatus.SUCCESS && calendarData.data) {
      return calendarData.data;
    }

    return null;
  },
  useGetCalendarByDates: ({
    masterIds,
    view,
    rangeFromDate,
    rangeToDate,
    serviceId,
    combinationId,
    orderStatus,
  }: PrivateCalendarQueryParams) => {
    const memoParams = useMemo<PrivateCalendarByDatesQueryParams>(
      () => ({
        masterIds,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
        orderStatus,
      }),
      [masterIds, view, rangeFromDate, rangeToDate, serviceId, combinationId, orderStatus],
    );

    const { data: calendarData, isPending } = useQuery<
      BaseResponse<GetCalendarByDatesResponse>,
      Error
    >({
      queryKey: ['monthCalendar', queryKeys.monthCalendar.byParams(memoParams)],
      queryFn: () => calendarApi.getCalendarByDates(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === ApiStatus.SUCCESS && calendarData.data) {
      return calendarData.data;
    }

    return null;
  },
};
