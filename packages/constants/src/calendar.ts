export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DAYS_NAME = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export type ScheduleOption = {
  value: string;
  label: string;
  pattern: number;
  daysOn: number[];
  dayOff: number[];
};

export const SCHEDULE_OPTIONS: ScheduleOption[] = [
  { value: 'weekly', label: 'Weekly', pattern: 7, daysOn: [1, 2, 3, 4, 5], dayOff: [6, 7] },
  { value: '2x2', label: '2x2', pattern: 4, daysOn: [1, 2], dayOff: [3, 4] },
  { value: '3x2', label: '3x2', pattern: 5, daysOn: [1, 2, 3], dayOff: [4, 5] },
  { value: 'custom', label: 'Custom', pattern: 1, daysOn: [1], dayOff: [] },
];

export const START_MINUTE = 9 * 60;
export const END_MINUTE = 18 * 60;
export const BREAK_START_MINUTES = 13 * 60;
export const BREAK_END_MINUTES = 14 * 60;
