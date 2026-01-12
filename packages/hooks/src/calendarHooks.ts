import { utils } from '@avoo/hooks/utils/utils';
import { calendarApi } from '@avoo/axios';
import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';

import {
  BaseResponse,
  GetCalendarResponse,
  GetCalendarByDatesResponse,
  PrivateCalendarByDatesQueryParams,
} from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from './queryKeys';

export const calendarHooks = {
  useGetCalendar: ({
    masterId,
    view,
    rangeFromDate,
    rangeToDate,
    serviceId,
    combinationId,
  }: PrivateCalendarQueryParams) => {
    const memoParams = useMemo<PrivateCalendarQueryParams>(
      () => ({
        masterId,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
      }),
      [masterId, view, rangeFromDate, rangeToDate, serviceId, combinationId],
    );

    const { data: calendarData, isPending } = useQuery<BaseResponse<GetCalendarResponse>, Error>({
      queryKey: ['calendar', queryKeys.calendar.byParams(memoParams)],
      queryFn: () => calendarApi.getCalendar(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === apiStatus.SUCCESS && calendarData.data) {
      return calendarData.data;
    }

    return null;
  },
  useGetCalendarByDates: ({
    masterId,
    view,
    rangeFromDate,
    rangeToDate,
    serviceId,
    combinationId,
  }: PrivateCalendarQueryParams) => {
    const memoParams = useMemo<PrivateCalendarByDatesQueryParams>(
      () => ({
        masterId,
        view,
        rangeFromDate,
        rangeToDate,
        serviceId,
        combinationId,
      }),
      [masterId, view, rangeFromDate, rangeToDate, serviceId, combinationId],
    );

    const { data: calendarData, isPending } = useQuery<
      BaseResponse<GetCalendarByDatesResponse>,
      Error
    >({
      queryKey: ['monthCalendar', queryKeys.monthCalendar.byParams(memoParams)],
      queryFn: () => calendarApi.getCalendarByDates(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === apiStatus.SUCCESS && calendarData.data) {
      return calendarData.data;
    }

    return null;
  },
};
