import { DEFAULT_SCHEDULE, SCHEDULE_OPTIONS } from '@avoo/constants';

export const scheduleUtils = {
  formatTime: (minutes: number): string => {
    if (minutes === 0) return '--:--';
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  },
  formatDate: (value?: string | null): string => {
    if (!value) return 'Ongoing';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Ongoing';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  },

  getPatternLabel: (pattern?: number | null): string => {
    if (pattern == null) return '';
    const option = SCHEDULE_OPTIONS.find((opt) => opt.pattern === pattern) ?? DEFAULT_SCHEDULE;
    return option.label;
  },
};
