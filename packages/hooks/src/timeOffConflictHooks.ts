import { useEffect, useMemo } from 'react';

import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import type { Exception, ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { VALUE_DATE_FORMAT } from '@avoo/constants';

import { type TimeOffFormValues, WholeDay } from '../types/timeOffType';
import { normalizeExceptionEndDate } from './utils/exceptionUtils';
import { calendarHooks } from './calendarHooks';
import { exceptionHooks } from './exceptionHooks';

type UseTimeOffConflictsParams = {
  values: TimeOffFormValues;
  masters: ShortMasterInfo[];
  excludeId?: number;
};

type TimeRange = {
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

const hasRangeOverlap = (rangeA: TimeRange, rangeB: TimeRange) =>
  rangeA.start.isBefore(rangeB.end) && rangeB.start.isBefore(rangeA.end);

const parseTimeToMinutes = (time: string | undefined) => {
  const [hours, minutes] = (time ?? '').split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
};

const buildSelectedRange = (values: TimeOffFormValues): TimeRange | null => {
  if (!values.startDate || !values.endDate) return null;

  const startMinutes =
    values.wholeDay === WholeDay.Whole ? 0 : parseTimeToMinutes(values.startTime);
  const endMinutes =
    values.wholeDay === WholeDay.Whole ? 24 * 60 : parseTimeToMinutes(values.endTime);

  if (startMinutes === null || endMinutes === null) return null;

  const start = dayjs(values.startDate, VALUE_DATE_FORMAT)
    .startOf('day')
    .add(startMinutes, 'minute');
  const end = dayjs(values.endDate, VALUE_DATE_FORMAT).startOf('day').add(endMinutes, 'minute');

  if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return null;

  return { start, end };
};

const getSelectedMasterIds = (masters: ShortMasterInfo[], staff?: string[]) => {
  const selectedStaff = staff ?? [];

  if (selectedStaff.includes('all')) {
    return masters.map((master) => master.id);
  }

  return selectedStaff.map(Number).filter((id): id is number => Number.isFinite(id));
};

const getConflictingExceptions = (
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
    const exceptionEnd = normalizeExceptionEndDate(exception.dateFrom, exception.dateTo)
      .startOf('day')
      .add(exception.endTimeMinutes, 'minute');

    if (
      !exceptionStart.isValid() ||
      !exceptionEnd.isValid() ||
      !exceptionEnd.isAfter(exceptionStart)
    ) {
      return false;
    }

    return hasRangeOverlap(selectedRange, { start: exceptionStart, end: exceptionEnd });
  });
};

const getAffectedBookings = (
  calendar: ReturnType<typeof calendarHooks.useGetCalendar>['data'],
  selectedRange: TimeRange | null,
) => {
  if (!selectedRange || !calendar?.length) return [] as AffectedBooking[];

  const affectedBookingsById = new Map<number, AffectedBooking>();

  calendar.forEach((masterSchedule) => {
    const masterId = masterSchedule.master?.id;
    const masterName =
      masterSchedule.master?.name ?? (masterId === undefined ? '' : `Master #${masterId}`);

    masterSchedule.days.forEach((day) => {
      day.events.forEach((event) => {
        const eventStart = dayjs(event.start);
        const eventEnd = dayjs(event.end);

        if (!eventStart.isValid() || !eventEnd.isValid() || !eventEnd.isAfter(eventStart)) return;

        if (hasRangeOverlap(selectedRange, { start: eventStart, end: eventEnd })) {
          affectedBookingsById.set(event.id, {
            id: event.id,
            start: event.start,
            end: event.end,
            title: event.title,
            duration: event.duration,
            price: event.price,
            note: typeof event.notes === 'string' ? event.notes : undefined,
            masterName,
          });
        }
      });
    });
  });

  return Array.from(affectedBookingsById.values()).sort(
    (currentBooking, nextBooking) =>
      dayjs(currentBooking.start).valueOf() - dayjs(nextBooking.start).valueOf(),
  );
};

export const timeOffConflictHooks = {
  useTimeOffConflicts: ({ values, masters, excludeId }: UseTimeOffConflictsParams) => {
    const {
      data: exceptionsPages,
      hasNextPage: hasNextExceptionsPage,
      isFetchingNextPage: isFetchingNextExceptionsPage,
      fetchNextPage: fetchNextExceptionsPage,
      isFetching: isExceptionsFetching,
    } = exceptionHooks.useGetExceptionsInfinite({ limit: 500 });

    useEffect(() => {
      if (hasNextExceptionsPage && !isFetchingNextExceptionsPage) {
        fetchNextExceptionsPage();
      }
    }, [hasNextExceptionsPage, isFetchingNextExceptionsPage, fetchNextExceptionsPage]);

    const existingExceptions = useMemo(
      () => exceptionsPages?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
      [exceptionsPages],
    );

    const selectedMasterIds = useMemo(
      () => getSelectedMasterIds(masters, values.staff),
      [masters, values.staff],
    );

    const selectedRange = useMemo(() => buildSelectedRange(values), [values]);

    const shouldCheckConflicts = selectedMasterIds.length > 0 && !!selectedRange;

    const { data: calendar } = calendarHooks.useGetCalendar(
      {
        masterIds: selectedMasterIds,
        rangeFromDate: values.startDate ?? '',
        rangeToDate: values.endDate ?? '',
      },
      { enabled: shouldCheckConflicts },
    );

    const isCalendarConflictsPending = shouldCheckConflicts && calendar === null;

    const isConflictsLoading =
      shouldCheckConflicts && (isExceptionsFetching || isCalendarConflictsPending);

    const conflictingExceptions = useMemo(
      () =>
        getConflictingExceptions(existingExceptions, selectedRange, selectedMasterIds, excludeId),
      [excludeId, existingExceptions, selectedMasterIds, selectedRange],
    );

    const conflictingMasters = useMemo(() => {
      const mastersById = new Map<number, string>();

      conflictingExceptions.forEach((exception) => {
        const masterId = exception.master.id;
        if (!mastersById.has(masterId)) {
          mastersById.set(masterId, exception.master.name ?? `Master #${masterId}`);
        }
      });

      return Array.from(mastersById.entries()).map(([id, name]) => ({ id, name }));
    }, [conflictingExceptions]);

    const affectedBookings = useMemo(
      () => getAffectedBookings(calendar, selectedRange),
      [calendar, selectedRange],
    );

    const affectedBookingsCount = affectedBookings.length;

    const isAllStaffSelected = values.staff?.includes('all') ?? false;

    const conflictMessage = useMemo(() => {
      const entryTypeName = 'entries';

      if (affectedBookingsCount > 0) {
        if (isAllStaffSelected && conflictingMasters.length > 1) {
          return `Conflicts: ${affectedBookingsCount} bookings will be affected for ${conflictingMasters.length} masters`;
        }

        return `Conflicts: ${affectedBookingsCount} bookings will be affected`;
      }

      if (conflictingExceptions.length > 0) {
        if (isAllStaffSelected && conflictingMasters.length > 1) {
          const previewNames = conflictingMasters
            .slice(0, 3)
            .map((master) => master.name)
            .join(', ');
          const moreCount = conflictingMasters.length - 3;

          if (moreCount > 0) {
            return `Looks like ${conflictingMasters.length} masters already have ${entryTypeName} in selected period (${previewNames} +${moreCount} more)`;
          }

          return `Looks like ${previewNames} already have entries in selected period`;
        }

        const firstConflict = conflictingExceptions[0];
        const dateLabel = dayjs(firstConflict.dateFrom).format('MMMM D, YYYY');
        const masterLabel = firstConflict.master.name ?? `Master #${firstConflict.master.id}`;
        return `Looks like ${masterLabel} already has an entry on ${dateLabel}`;
      }

      return null;
    }, [affectedBookingsCount, conflictingExceptions, conflictingMasters, isAllStaffSelected]);

    return {
      hasConflict: conflictMessage !== null,
      conflictMessage,
      isConflictsLoading,
      affectedBookings,
    };
  },
};
