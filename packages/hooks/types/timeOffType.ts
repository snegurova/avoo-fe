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

export default TimeOffType;
