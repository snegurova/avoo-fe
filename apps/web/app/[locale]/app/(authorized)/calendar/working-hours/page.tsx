'use client';

import { useMemo } from 'react';
import { scheduleHooks } from '@avoo/hooks';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import SchedulesControls from '@/_components/SchedulesControls/SchedulesControls';
import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import EditCalendarIcon from '@/_icons/EditCalendarIcon';
import Link from 'next/link';
import ScheduleList from '@/_components/ScheduleList/ScheduleList';

export default function WorkingHoursPage() {
  const { data, fetchNextPage, hasNextPage } = scheduleHooks.useGetSchedulesInfinite({
    limit: 10,
  });

  const schedules = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  return (
    <AppWrapper withPadding>
      <SchedulesControls setSearchQuery={() => {}} />
      {schedules.length === 0 ? (
        <AppPlaceholder
          title='Setup you first working schedule'
          icon={<EditCalendarIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />}
          description={
            <p>
              <Link href='#' className='text-primary-300'>
                Create a working schedule
              </Link>{' '}
              to define when your masters are available for bookings.
            </p>
          }
        />
      ) : (
        <ScheduleList hasMore={hasNextPage} schedules={schedules} incrementPage={fetchNextPage} />
      )}
    </AppWrapper>
  );
}
