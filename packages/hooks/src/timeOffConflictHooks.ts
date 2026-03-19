import { useEffect, useMemo } from 'react';

import dayjs from 'dayjs';

import type { UseTimeOffConflictsParams } from '@avoo/hooks/types/timeOffType';

import { timeOffConflictUtils } from './utils/timeOffConflictUtils';
import { calendarHooks } from './calendarHooks';
import { exceptionHooks } from './exceptionHooks';

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
      () => timeOffConflictUtils.getSelectedMasterIds(masters, values.staff),
      [masters, values.staff],
    );

    const selectedRange = useMemo(() => timeOffConflictUtils.buildSelectedRange(values), [values]);

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
        timeOffConflictUtils.getConflictingExceptions(
          existingExceptions,
          selectedRange,
          selectedMasterIds,
          excludeId,
        ),
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
      () => timeOffConflictUtils.getAffectedBookings(calendar, selectedRange),
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

export const timeOffConflictsHooks = timeOffConflictHooks;
