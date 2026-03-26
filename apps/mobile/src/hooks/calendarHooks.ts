import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { calendarApi } from '@avoo/axios';
import type {
  CalendarItem,
  GetCalendarResponse,
  OrderStatusValue,
  PrivateGetAvailabilityQueryParams,
  ShortMasterInfo,
} from '@avoo/axios/types/apiTypes';
import { timeUtils } from '@avoo/shared';

export type Appointment = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  service: string;
  status: OrderStatusValue;
  master: ShortMasterInfo;
};

export const calendarMobileHooks = {
  useCalendarMasters(calendarData: GetCalendarResponse | null | undefined): ShortMasterInfo[] {
    return useMemo(() => {
      if (!calendarData?.length) return [];
      const byId = new Map<number, ShortMasterInfo>();
      calendarData.forEach((schedule) => {
        const m = schedule.master;
        if (!m) return;
        if (byId.has(m.id)) return;
        byId.set(m.id, m);
      });
      return Array.from(byId.values());
    }, [calendarData]);
  },

  useCalendarAppointments(calendarData: GetCalendarResponse | null | undefined): Appointment[] {
    return useMemo(() => {
      const list: CalendarItem[] = Array.isArray(calendarData) ? calendarData : [];
      const result: Appointment[] = [];

      list.forEach((masterSchedule: CalendarItem) => {
        const master = masterSchedule.master;
        if (!master) return;
        const days = masterSchedule.days ?? [];

        days.forEach((day) => {
          const dayDate = day.date ?? timeUtils.formatDate(new Date());
          (day.events ?? []).forEach((event) => {
            const startTime = timeUtils.getTime(event.start);
            const endTime = timeUtils.getTime(event.end);

            result.push({
              id: String(event.id),
              date: dayDate,
              startTime,
              endTime,
              clientName: typeof event.customerName === 'string' ? event.customerName : '',
              service: event.title || 'Service',
              status: event.status,
              master,
            });
          });
        });
      });

      return result.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [calendarData]);
  },

  useGetAvailableSlots: (
    params: {
      serviceId?: number;
      masterIds?: number[];
      date: string | null;
      duration: number;
    },
    options?: { enabled?: boolean },
  ) => {
    const { data, isLoading } = useQuery({
      queryKey: ['availableSlots', params],
      queryFn: async (): Promise<string[]> => {
        if (!params.date || !params.serviceId) return [];

        const selectedDayUTC = new Date(`${params.date}T00:00:00Z`);

        const isSameDayUTC = (a: Date, b: Date): boolean =>
          a.getUTCFullYear() === b.getUTCFullYear() &&
          a.getUTCMonth() === b.getUTCMonth() &&
          a.getUTCDate() === b.getUTCDate();

        const now = new Date();
        const isToday = isSameDayUTC(selectedDayUTC, now);

        let rangeFrom: Date;
        if (isToday) {
          // Начинаем с текущего момента, округлённого вверх до 15 мин
          const mins = now.getUTCMinutes();
          const roundedMins = Math.ceil(mins / 15) * 15;
          rangeFrom = new Date(now);
          if (roundedMins >= 60) {
            rangeFrom.setUTCHours(now.getUTCHours() + 1, 0, 0, 0);
          } else {
            rangeFrom.setUTCMinutes(roundedMins, 0, 0);
          }
        } else {
          // Начинаем с UTC-полуночи выбранного дня
          rangeFrom = selectedDayUTC;
        }

        const slots: string[] = [];
        const MAX_ITERATIONS = 24;
        let iteration = 0;

        while (iteration < MAX_ITERATIONS) {
          iteration++;

          const apiParams: PrivateGetAvailabilityQueryParams = {
            rangeFromTime: rangeFrom.toISOString().slice(0, 16) + ':00Z',
            workingTimeOnly: true,
          };
          if (params.serviceId) apiParams.serviceId = params.serviceId;
          if (params.masterIds?.length) apiParams.masterIds = params.masterIds;

          const res = await calendarApi.getPrivateAvailability(apiParams);
          const windowStart = res?.data?.availability?.start;
          const windowEnd = res?.data?.availability?.end;

          if (!windowStart || !windowEnd) break;

          const windowStartDate = new Date(windowStart);
          const windowEndDate = new Date(windowEnd);

          // Окно началось в другой UTC-день — стоп
          if (!isSameDayUTC(windowStartDate, selectedDayUTC)) break;

          const durationMs = params.duration * 60000;
          let chip = windowStartDate.getTime();
          const endMs = windowEndDate.getTime();

          while (chip + durationMs <= endMs) {
            const chipDate = new Date(chip);
            // Чип вышел за пределы UTC-дня — стоп
            if (!isSameDayUTC(chipDate, selectedDayUTC)) break;
            slots.push(timeUtils.convertDateToString(chipDate));
            chip += 15 * 60000;
          }

          rangeFrom = windowEndDate;

          if (!isSameDayUTC(windowEndDate, selectedDayUTC)) break;
        }

        return slots;
      },
      enabled: !!params.date && !!params.serviceId && options?.enabled !== false,
      staleTime: 30 * 1000,
    });

    return { slots: data ?? [], isLoading };
  },
};
