'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { scheduleHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ScheduleList from '@/_components/ScheduleList/ScheduleList';
import SchedulesControls from '@/_components/SchedulesControls/SchedulesControls';
import EditCalendarIcon from '@/_icons/EditCalendarIcon';

export default function WorkingHoursPage() {
  const t = useTranslations('private.calendar.workingHours');
  const isPending = useApiStatusStore((state) => state.isPending);
  const { queryParams, setSearchQuery, onSortClick, activeSortDirection, activeSortField } =
    scheduleHooks.useScheduleQuery();
  const { data, fetchNextPage, hasNextPage } = scheduleHooks.useGetSchedulesInfinite({
    ...queryParams,
  });

  const schedules = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  return (
    <AppWrapper withPadding>
      <SchedulesControls
        setSearchQuery={setSearchQuery}
        onSortClick={onSortClick}
        activeSortDirection={activeSortDirection}
        activeSortField={activeSortField}
      />
      {schedules.length === 0 && !queryParams.search ? (
        <AppPlaceholder
          title={isPending ? t('loading') : t('setupFirstSchedule')}
          icon={<EditCalendarIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />}
          description={
            isPending ? null : (
              <p>
                {t.rich('setupScheduleDescription', {
                  link: (chunks) => (
                    <Link href='#' className='text-primary-300'>
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            )
          }
        />
      ) : (
        <ScheduleList hasMore={hasNextPage} schedules={schedules} incrementPage={fetchNextPage} />
      )}
    </AppWrapper>
  );
}
