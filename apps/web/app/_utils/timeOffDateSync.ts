import dayjs from 'dayjs';

export const getSyncedEndDate = (startDate: string, endDate?: string | null): string | null => {
  if (!startDate) return null;
  if (!endDate || dayjs(endDate).isBefore(dayjs(startDate), 'day')) {
    return startDate;
  }

  return null;
};
