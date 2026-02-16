'use client';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Controls, { ControlsVariant } from '@/_components/Controls/Controls';
import TimeOffList from '@/_components/TimeOffList/TimeOffList';
import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import EditCalendarIcon from '@/_icons/EditCalendarIcon';
import { appRoutes } from '@/_routes/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Exception } from '@avoo/axios/types/apiTypes';
import { exceptionHooks } from '@avoo/hooks';

export default function TimeOffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const exceptionsData = exceptionHooks.useGetExceptions();
  const items: Exception[] = exceptionsData?.items ?? [];

  const router = useRouter();

  const handleAddTimeOff = useCallback(() => {
    router.push(`${appRoutes.AddTimeOff}`);
  }, [router]);

  return (
    <AppWrapper className='flex-1 min-h-0'>
      <div className='flex-1 min-h-0 overflow-auto hide-scrollbar p-6'>
        <Controls
          title='Schedule exception'
          onAddItem={handleAddTimeOff}
          addLabel='Add time off'
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder='Search by master`s name'
          variant={ControlsVariant.StackedSearch}
        />

        {items.length === 0 ? (
          <AppPlaceholder
            title='No time off added yet'
            icon={<EditCalendarIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />}
            description={
              <p>
                <Link href={appRoutes.AddTimeOff} className='text-primary-300 font-bold'>
                  Add time off
                </Link>
                , vacations, breaks, or unavailable hours to keep the schedule accurate.
              </p>
            }
          />
        ) : (
          <TimeOffList items={items} />
        )}
      </div>
    </AppWrapper>
  );
}
