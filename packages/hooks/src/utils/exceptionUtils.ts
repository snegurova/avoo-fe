import dayjs from 'dayjs';

import type { CreateExceptionRequest } from '@avoo/axios/types/apiTypes';
import { VALUE_DATE_FORMAT } from '@avoo/constants';
import type { ExceptionFormData, MasterInfo } from '@avoo/hooks/types/timeOffType';
import { TimeOffMode, WholeDay } from '@avoo/hooks/types/timeOffType';

export const exceptionUtils = {
  timeToMinutes: (time: string): number => {
    const [hours, minutes] = (time || '').split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
    return hours * 60 + minutes;
  },

  toIsoDateString: (date: string) => dayjs(date, VALUE_DATE_FORMAT).format(VALUE_DATE_FORMAT),

  getLocalDateFromUtc: (utcDateTime: string | null | undefined): string | null => {
    if (!utcDateTime) return null;
    const date = dayjs(utcDateTime);
    if (!date.isValid()) return null;

    return date.format(VALUE_DATE_FORMAT);
  },

  normalizeExceptionEndDate: (
    dateFrom: string | null | undefined,
    dateTo: string | null | undefined,
  ) => {
    const startDate = dayjs(dateFrom);
    const endDate = dayjs(dateTo);

    if (!startDate.isValid() || !endDate.isValid()) return endDate;

    return endDate.isAfter(startDate, 'day') ? endDate.subtract(1, 'day') : endDate;
  },
  normalizeMasterIds: (staff: string[], availableMasters?: MasterInfo[]) => {
    if (staff.includes('all')) {
      const masterIds = availableMasters?.map((master) => master.id).filter(Number.isFinite);
      return masterIds && masterIds.length > 0 ? masterIds : undefined;
    }
    const parsedIds = staff.map(Number).filter((id) => Number.isFinite(id));
    return parsedIds.length > 0 ? parsedIds : undefined;
  },

  buildMastersLabel: (staff: string[], masters?: MasterInfo[]) => {
    if (staff.includes('all')) return 'All staff';
    const names = staff
      .map((value) => {
        const id = Number(value);
        const foundMaster = masters?.find((candidate) => candidate.id === id);
        return foundMaster?.name ?? (Number.isFinite(id) ? `Master #${id}` : null);
      })
      .filter((name): name is string => name != null);
    return names.length > 0 ? names.join(', ') : 'selected masters';
  },

  mapTypeToApi: (type: string, mode?: TimeOffMode): CreateExceptionRequest['type'] => {
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
  },

  formValuesToPayload: (
    data: ExceptionFormData,
    masters?: MasterInfo[],
  ): CreateExceptionRequest => {
    const isWholeDay = data.wholeDay === WholeDay.Whole;

    return {
      masterIds: exceptionUtils.normalizeMasterIds(data.staff, masters),
      dateFrom: exceptionUtils.toIsoDateString(data.startDate),
      dateTo: exceptionUtils.toIsoDateString(data.endDate),
      type: exceptionUtils.mapTypeToApi(data.type, data.mode),
      startTimeMinutes: isWholeDay ? 0 : exceptionUtils.timeToMinutes(data.startTime),
      endTimeMinutes: isWholeDay ? 24 * 60 : exceptionUtils.timeToMinutes(data.endTime),
      ...(data.note?.trim() ? { note: data.note.trim() } : {}),
    };
  },
};
