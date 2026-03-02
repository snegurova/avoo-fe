import type { CreateExceptionRequest } from '@avoo/axios/types/apiTypes';

export enum TimeOffType {
  Personal = 'personal',
  Holiday = 'holiday',
  Vacation = 'vacation',
  Sick = 'sick',
  Other = 'other',
}

export enum TimeOffMode {
  TimeOff = 'timeOff',
  ExtraTime = 'extraTime',
}

export enum WholeDay {
  Whole = 'whole',
  Partial = 'partial',
}

export const timeOffTypeLabels: Record<TimeOffType, string> = {
  [TimeOffType.Personal]: 'Personal break',
  [TimeOffType.Holiday]: 'Holiday (Salon)',
  [TimeOffType.Vacation]: 'Vacation',
  [TimeOffType.Sick]: 'Sick Leave',
  [TimeOffType.Other]: 'Other',
};

export const timeOffTypes: {
  value: TimeOffType;
  api: CreateExceptionRequest['type'];
}[] = [
  { value: TimeOffType.Personal, api: 'PERSONAL_OFF' },
  { value: TimeOffType.Holiday, api: 'HOLIDAY_OFF' },
  { value: TimeOffType.Vacation, api: 'VACATION' },
  { value: TimeOffType.Sick, api: 'SICK_LEAVE' },
  { value: TimeOffType.Other, api: 'OTHER_OFF' },
];

export default TimeOffType;
