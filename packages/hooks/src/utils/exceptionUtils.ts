import dayjs from 'dayjs';
import { VALUE_DATE_FORMAT } from '../../../../apps/web/app/_constants/dateFormats';
import { CreateExceptionRequest } from '@avoo/axios/types/apiTypes';
import { WholeDay, TimeOffMode } from '@avoo/hooks/types/timeOffType';

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

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return hours * 60 + minutes;
};

export const toLocalMidnightIso = (date: string) =>
  dayjs(date, VALUE_DATE_FORMAT).startOf('day').toISOString();

export const normalizeMasterIds = (staff: string[], availableMasters?: MasterInfo[]) => {
  if (staff.includes('all')) {
    const masterIds = availableMasters?.map((master) => master.id).filter(Number.isFinite);
    return masterIds && masterIds.length > 0 ? masterIds : undefined;
  }
  const parsedIds = staff.map(Number).filter((id) => Number.isFinite(id));
  return parsedIds.length > 0 ? parsedIds : undefined;
};

export const buildMastersLabel = (staff: string[], masters?: MasterInfo[]) => {
  if (staff.includes('all')) return 'All staff';
  const names = staff
    .map((value) => {
      const id = Number(value);
      const foundMaster = masters?.find((candidate) => candidate.id === id);
      return foundMaster?.name ?? (Number.isFinite(id) ? `Master #${id}` : null);
    })
    .filter((name): name is string => name != null);
  return names.length > 0 ? names.join(', ') : 'selected masters';
};

export const mapTypeToApi = (type: string, mode?: TimeOffMode): CreateExceptionRequest['type'] => {
  const normalizedType = (type ?? '').trim().toLowerCase();
  if (mode === TimeOffMode.ExtraTime) {
    switch (normalizedType) {
      case 'holiday':
        return 'HOLIDAY_WORKING';
      case 'vacation':
        return 'VACATION_WORKING';
      case 'other':
        return 'OTHER_WORKING';
      default:
        return 'PERSONAL_WORKING';
    }
  }

  switch (normalizedType) {
    case 'holiday':
      return 'HOLIDAY_OFF';
    case 'vacation':
      return 'VACATION';
    case 'sick':
      return 'SICK_LEAVE';
    case 'other':
      return 'OTHER_OFF';
    default:
      return 'PERSONAL_OFF';
  }
};

export const formValuesToPayload = (
  data: ExceptionFormData,
  masters?: MasterInfo[],
): CreateExceptionRequest => {
  const isWholeDay = data.wholeDay === 'whole';

  return {
    masterIds: normalizeMasterIds(data.staff, masters),
    dateFrom: toLocalMidnightIso(data.startDate),
    dateTo: toLocalMidnightIso(data.endDate),
    type: mapTypeToApi(data.type, data.mode),
    startTimeMinutes: isWholeDay ? 0 : timeToMinutes(data.startTime),
    endTimeMinutes: isWholeDay ? 24 * 60 : timeToMinutes(data.endTime),
    ...(data.note?.trim() ? { note: data.note.trim() } : {}),
  };
};
