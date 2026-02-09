import { useMemo } from 'react';
import { timeUtils } from '@avoo/shared';
import type {
  CalendarItem,
  GetCalendarResponse,
  OrderStatusValue,
  ShortMasterInfo,
} from '@avoo/axios/types/apiTypes';

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
  useCalendarMasters(
    calendarData: GetCalendarResponse | null | undefined,
  ): ShortMasterInfo[] {
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

  useCalendarAppointments(
    calendarData: GetCalendarResponse | null | undefined,
  ): Appointment[] {
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
              clientName: event.customerName || '',
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
};
