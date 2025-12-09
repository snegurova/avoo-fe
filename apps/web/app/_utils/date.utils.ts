'use client';

export const convertDateToStringDateFormat = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const addDaysToDate = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
export const getNextMonday = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  const daysToAdd = (8 - day) % 7 || 7;
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

export const convertToMidnightDate = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};
