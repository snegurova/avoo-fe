export const TYPE_OF_SCHEDULE = {
  weekly: { name: 'Weekly', pattern: 7, workingDaysCount: 5 },
  '2x2': { name: '2 on / 2 off', pattern: 4, workingDaysCount: 2 },
  '3x2': { name: '3 on / 2 off', pattern: 5, workingDaysCount: 3 },
  '2x1': { name: '2 on / 1 off', pattern: 3, workingDaysCount: 2 },
  custom: { name: 'Custom', pattern: 1, workingDaysCount: 1 },
};

export type ScheduleKey = keyof typeof TYPE_OF_SCHEDULE;

export const START_MINUTE = 9 * 60;
export const END_MINUTE = 18 * 60;
export const BREAK_START_MINUTES = 13 * 60;
export const BREAK_END_MINUTES = 14 * 60;

export const DAYS_NAME = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const WORKING_HOURS_OPTIONS = Array.from({ length: 48 }, (_, i) => ({
  label:
    i % 2 === 0
      ? `${Math.floor(i / 2)
          .toString()
          .padStart(2, '0')}:00`
      : `${Math.floor(i / 2)
          .toString()
          .padStart(2, '0')}:30`,
  value: String(i * 30),
}));
