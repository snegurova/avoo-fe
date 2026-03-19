import dayjs from 'dayjs';

import { type TimeOffFormValues, WholeDay } from '@avoo/hooks/types/timeOffType';

type TimeOffValidationValues = Required<
  Pick<TimeOffFormValues, 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'wholeDay'>
>;

export const validateEndDateFactory =
  (getValues: <K extends keyof TimeOffValidationValues>(field: K) => TimeOffValidationValues[K]) =>
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
