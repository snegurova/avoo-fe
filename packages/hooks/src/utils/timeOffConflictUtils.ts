import dayjs from 'dayjs';

import type { Exception, GetCalendarResponse, ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { VALUE_DATE_FORMAT } from '@avoo/constants';

import type { AffectedBooking, TimeOffFormValues, TimeRange } from '../../types/timeOffType';
import { WholeDay } from '../../types/timeOffType';
import { exceptionUtils } from './exceptionUtils';

export const timeOffConflictUtils = {
  hasRangeOverlap: (rangeA: TimeRange, rangeB: TimeRange) =>
    rangeA.start.isBefore(rangeB.end) && rangeB.start.isBefore(rangeA.end),

  parseTimeToMinutes: (time: string | undefined) => {
    const [hours, minutes] = (time ?? '').split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    return hours * 60 + minutes;
  },

  buildSelectedRange: (values: TimeOffFormValues): TimeRange | null => {
    if (!values.startDate || !values.endDate) return null;

    const startMinutes =
      values.wholeDay === WholeDay.Whole
        ? 0
        : timeOffConflictUtils.parseTimeToMinutes(values.startTime);
    const endMinutes =
      values.wholeDay === WholeDay.Whole
        ? 24 * 60
        : timeOffConflictUtils.parseTimeToMinutes(values.endTime);

    if (startMinutes === null || endMinutes === null) return null;

    const start = dayjs(values.startDate, VALUE_DATE_FORMAT)
      .startOf('day')
      .add(startMinutes, 'minute');
    const end = dayjs(values.endDate, VALUE_DATE_FORMAT).startOf('day').add(endMinutes, 'minute');

    if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return null;

    return { start, end };
  },

  getSelectedMasterIds: (masters: ShortMasterInfo[], staff?: string[]) => {
    const selectedStaff = staff ?? [];

    if (selectedStaff.includes('all')) {
      return masters.map((master) => master.id);
    }

    return selectedStaff.map(Number).filter((id): id is number => Number.isFinite(id));
  },

  getConflictingExceptions: (
    existingExceptions: Exception[],
    selectedRange: TimeRange | null,
    selectedMasterIds: number[],
    excludeId?: number,
  ) => {
    if (!selectedRange || selectedMasterIds.length === 0) return [];

    const selectedMasterIdsSet = new Set(selectedMasterIds);

    return existingExceptions.filter((exception) => {
      if (excludeId !== undefined && exception.id === excludeId) return false;
      if (!selectedMasterIdsSet.has(exception.master.id)) return false;

      const exceptionStart = dayjs(exception.dateFrom)
        .startOf('day')
        .add(exception.startTimeMinutes, 'minute');
      const exceptionEnd = exceptionUtils
        .normalizeExceptionEndDate(exception.dateFrom, exception.dateTo)
        .startOf('day')
        .add(exception.endTimeMinutes, 'minute');

      if (
        !exceptionStart.isValid() ||
        !exceptionEnd.isValid() ||
        !exceptionEnd.isAfter(exceptionStart)
      ) {
        return false;
      }

      return timeOffConflictUtils.hasRangeOverlap(selectedRange, {
        start: exceptionStart,
        end: exceptionEnd,
      });
    });
  },

  getAffectedBookings: (
    calendar: GetCalendarResponse | null | undefined,
    selectedRange: TimeRange | null,
  ) => {
    if (!selectedRange || !calendar?.length) return [] as AffectedBooking[];

    const affectedBookingsById = new Map<number, AffectedBooking>();

    calendar.forEach((masterSchedule) => {
      const masterId = masterSchedule.master?.id;
      const masterName =
        masterSchedule.master?.name ?? (masterId === undefined ? '' : `Master #${masterId}`);
      const masterAvatarUrl = masterSchedule.master?.avatarPreviewUrl ?? null;

      masterSchedule.days.forEach((day) => {
        day.events.forEach((event) => {
          const eventStart = dayjs(event.start);
          const eventEnd = dayjs(event.end);

          if (!eventStart.isValid() || !eventEnd.isValid() || !eventEnd.isAfter(eventStart)) {
            return;
          }

          if (
            timeOffConflictUtils.hasRangeOverlap(selectedRange, {
              start: eventStart,
              end: eventEnd,
            })
          ) {
            affectedBookingsById.set(event.id, {
              id: event.id,
              start: event.start,
              end: event.end,
              title: event.title,
              duration: event.duration,
              price: event.price,
              note: typeof event.notes === 'string' ? event.notes : undefined,
              masterName,
              masterAvatarUrl,
            });
          }
        });
      });
    });

    return Array.from(affectedBookingsById.values()).sort(
      (currentBooking, nextBooking) =>
        dayjs(currentBooking.start).valueOf() - dayjs(nextBooking.start).valueOf(),
    );
  },
};
