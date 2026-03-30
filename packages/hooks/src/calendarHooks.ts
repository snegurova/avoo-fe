import { useMemo } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';

import { calendarApi } from '@avoo/axios';
import {
  ApiStatus,
  BaseResponse,
  GetAvailabilityResponse,
  GetCalendarByDatesResponse,
  GetCalendarResponse,
  GetPublicCalendarByDatesResponse,
  GetPublicCalendarResponse,
  PrivateCalendarByDatesQueryParams,
  PrivateCalendarQueryParams,
  PrivateGetAvailabilityQueryParams,
  PublicCalendarByDatesQueryParams,
  PublicCalendarQueryParams,
  PublicGetAvailabilityQueryParams,
} from '@avoo/axios/types/apiTypes';
import { utils } from '@avoo/hooks/utils/utils';
import { timeUtils } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

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
  useGetCalendarByDatesForTimeOff: (
    params: PrivateCalendarQueryParams,
    options?: { enabled?: boolean },
  ) => {
    const memoParams = useMemo<PrivateCalendarByDatesQueryParams>(() => params, [params]);

    const {
      data: calendarData,
      isPending,
      refetch,
    } = useQuery<BaseResponse<GetCalendarByDatesResponse>, Error>({
      queryKey: ['monthCalendar', 'timeOff', queryKeys.monthCalendar.byParams(memoParams)],
      queryFn: () => calendarApi.getCalendarByDates(memoParams),
      enabled: options?.enabled ?? true,
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === ApiStatus.SUCCESS && calendarData.data) {
      return { data: calendarData.data, refetch, isPending };
    }

    return { data: null, refetch, isPending };
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
  useGetPrivateAvailability: () => {
    const mutation = useMutation<
      BaseResponse<GetAvailabilityResponse>,
      Error,
      PrivateGetAvailabilityQueryParams
    >({
      mutationFn: (params: PrivateGetAvailabilityQueryParams) =>
        calendarApi.getPrivateAvailability(params),
    });

    utils.useSetPendingApi(mutation.isPending);

    const slots = useCalendarStore((state) => state.slots);

    const getAvailableDate = async ({
      rangeFromTime,
      masterIds,
      serviceId,
      combinationId,
      index,
    }: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    }) => {
      let checkedDate = rangeFromTime;
      const now = new Date();

      const minutes = now.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 15) * 15;
      if (roundedMinutes === 60) {
        now.setHours(now.getHours() + 1);
        now.setMinutes(0, 0, 0);
      } else {
        now.setMinutes(roundedMinutes, 0, 0);
      }
      const inputDate = new Date(rangeFromTime);
      if (inputDate < now) {
        checkedDate = timeUtils.convertDateToString(now);
      }

      let tryCount = 0;
      while (true) {
        const params: PrivateGetAvailabilityQueryParams = {
          rangeFromTime: timeUtils.convertLocalToUTC(checkedDate),
          workingTimeOnly: false,
        };

        if (masterIds) {
          params.masterIds = masterIds;
        }
        if (serviceId) {
          params.serviceId = serviceId;
        }
        if (combinationId) {
          params.combinationId = combinationId;
        }

        const res = await mutation.mutateAsync(params);
        let availableDate = res?.data?.availability?.start;
        if (!availableDate) {
          return null;
        }

        const currDuration = slots?.[index]?.duration || 15;

        let overlapped = false;
        let nextCheckedDate = null;

        if (slots) {
          const availableStart = new Date(availableDate);
          const availableEnd = new Date(availableStart.getTime() + currDuration * 60000);

          for (let i = 0; i < slots.length; i++) {
            if (i === index) continue;
            const slot = slots[i];
            if (slot.masterId && masterIds && !masterIds.includes(slot.masterId)) {
              continue;
            }

            const slotStart = new Date(slot.date);
            const slotEnd = new Date(slotStart.getTime() + (slot.duration || 15) * 60000);
            if (slotStart < availableEnd && slotEnd > availableStart) {
              overlapped = true;
              if (!nextCheckedDate || slotEnd > new Date(nextCheckedDate)) {
                nextCheckedDate = slotEnd;
              }
            }
          }
        }

        if (!overlapped) {
          return availableDate;
        }
        if (nextCheckedDate) {
          checkedDate = timeUtils.convertDateToString(nextCheckedDate);
        } else {
          return null;
        }

        tryCount++;
        if (tryCount > (slots?.length || 0)) {
          return null;
        }
      }
    };

    if (mutation.data?.status === ApiStatus.SUCCESS && mutation.data.data) {
      return {
        getAvailableDate,
      };
    }

    return {
      getAvailableDate,
    };
  },
  useGetPublicAvailability: (userId: number) => {
    const mutation = useMutation<
      BaseResponse<GetAvailabilityResponse>,
      Error,
      PublicGetAvailabilityQueryParams
    >({
      mutationFn: (params: PublicGetAvailabilityQueryParams) =>
        calendarApi.getPublicAvailability(params),
    });

    utils.useSetPendingApi(mutation.isPending);

    const slots = useCalendarStore((state) => state.slots);

    const getAvailableDate = async ({
      rangeFromTime,
      masterIds,
      serviceId,
      combinationId,
      index,
    }: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    }) => {
      let checkedDate = rangeFromTime;
      const now = new Date();

      const minutes = now.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 15) * 15;
      if (roundedMinutes === 60) {
        now.setHours(now.getHours() + 1);
        now.setMinutes(0, 0, 0);
      } else {
        now.setMinutes(roundedMinutes, 0, 0);
      }
      const inputDate = new Date(rangeFromTime);
      if (inputDate < now) {
        checkedDate = timeUtils.convertDateToString(now);
      }

      let tryCount = 0;
      while (true) {
        const params: PublicGetAvailabilityQueryParams = {
          rangeFromTime: timeUtils.convertLocalToUTC(checkedDate),
          userId,
        };

        if (masterIds) {
          params.masterIds = masterIds;
        }
        if (serviceId) {
          params.serviceId = serviceId;
        }
        if (combinationId) {
          params.combinationId = combinationId;
        }

        const res = await mutation.mutateAsync(params);
        let availableDate = res?.data?.availability?.start;
        if (!availableDate) {
          return null;
        }

        const currDuration = slots?.[index]?.duration || 15;

        let overlapped = false;
        let nextCheckedDate = null;

        if (slots) {
          const availableStart = new Date(availableDate);
          const availableEnd = new Date(availableStart.getTime() + currDuration * 60000);

          for (let i = 0; i < slots.length; i++) {
            if (i === index) continue;
            const slot = slots[i];
            if (slot.masterId && masterIds && !masterIds.includes(slot.masterId)) {
              continue;
            }

            const slotStart = new Date(slot.date);
            const slotEnd = new Date(slotStart.getTime() + (slot.duration || 15) * 60000);
            if (slotStart < availableEnd && slotEnd > availableStart) {
              overlapped = true;
              if (!nextCheckedDate || slotEnd > new Date(nextCheckedDate)) {
                nextCheckedDate = slotEnd;
              }
            }
          }
        }

        if (!overlapped) {
          return availableDate;
        }
        if (nextCheckedDate) {
          checkedDate = timeUtils.convertDateToString(nextCheckedDate);
        } else {
          return null;
        }

        tryCount++;
        if (tryCount > (slots?.length || 0)) {
          return null;
        }
      }
    };

    if (mutation.data?.status === ApiStatus.SUCCESS && mutation.data.data) {
      return {
        getAvailableDate,
      };
    }

    return {
      getAvailableDate,
    };
  },
};
