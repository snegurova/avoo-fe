import type { Dayjs } from 'dayjs';

import type { CreateExceptionRequest } from '@avoo/axios/types/apiTypes';
import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';

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

export type TimeOffFormValues = {
  mode?: TimeOffMode;
  staff?: string[];
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  wholeDay?: WholeDay;
};

export type MasterInfo = { id: number; name?: string };

export type ExceptionFormData = {
  mode: TimeOffMode;
  wholeDay: WholeDay;
  staff: string[];
  startDate: string;
  endDate: string;
  type: string;
  startTime: string;
  endTime: string;
  note?: string;
};

export type UseTimeOffConflictsParams = {
  values: TimeOffFormValues;
  masters: ShortMasterInfo[];
  excludeId?: number;
};

export type TimeRange = {
  start: Dayjs;
  end: Dayjs;
};

export type AffectedBooking = {
  id: number;
  start: string;
  end: string;
  title: string;
  duration: number;
  price: number;
  note?: string;
  masterName: string;
};

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
