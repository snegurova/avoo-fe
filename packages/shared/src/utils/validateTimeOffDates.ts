import dayjs from 'dayjs';
import { WholeDay } from '@avoo/hooks/types/timeOffType';

export type TimeOffFormValues = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  wholeDay: WholeDay;
};

export const validateEndDateFactory =
  (getValues: <K extends keyof TimeOffFormValues>(field: K) => TimeOffFormValues[K]) =>
  (end: string) => {
    const start = dayjs(getValues('startDate'));
    const endDate = dayjs(end);
    if (!start.isValid() || !endDate.isValid()) return 'Invalid date';
    if (start.isAfter(endDate, 'day')) return 'End date/time must be after start date/time.';

    if (getValues('wholeDay') !== WholeDay.Whole) {
      const parseMinutes = (time: string) => {
        const [hour, minute] = (time || '').split(':').map(Number);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
        return hour * 60 + minute;
      };
      const startMinutes = parseMinutes(getValues('startTime'));
      const endMinutes = parseMinutes(getValues('endTime'));
      if (start.isSame(endDate, 'day') && startMinutes >= endMinutes)
        return 'End date/time must be after start date/time.';
    }

    return true;
  };

export const validateTimeOffUtils = {
  validateEndDateFactory,
};

export default validateTimeOffUtils;
