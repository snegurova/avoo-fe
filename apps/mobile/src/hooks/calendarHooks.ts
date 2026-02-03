import { useMemo } from 'react';
import { timeUtils } from '@avoo/shared';
import type { GetCalendarResponse, OrderStatusValue } from '@avoo/axios/types/apiTypes';

export type Appointment = {
  id: string;
  masterId: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  service: string;
  status: OrderStatusValue;
};

export function useCalendarAppointments(
  calendarData: GetCalendarResponse | null | undefined,
): Appointment[] {
  return useMemo(() => {
    if (!calendarData) return [];
    const result: Appointment[] = [];

    calendarData.forEach((masterSchedule) => {
      const masterId = String(masterSchedule.masterId);

      masterSchedule.days.forEach((day) => {
        day.events.forEach((event) => {
          const startDate = new Date(event.start);

          const startTime = timeUtils.getTime(event.start);
          const endTime = timeUtils.getTime(event.end);

          result.push({
            id: String(event.id),
            masterId,
            date: timeUtils.formatDate(startDate),
            startTime,
            endTime,
            clientName: event.customerName || '',
            service: event.title || 'Service',
            status: event.status,
          });
        });
      });
    });

    return result;
  }, [calendarData]);
}
