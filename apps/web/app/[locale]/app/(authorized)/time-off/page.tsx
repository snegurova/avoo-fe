'use client';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Controls, { ControlsVariant } from '@/_components/Controls/Controls';
import TimeOffList from '@/_components/TimeOffList/TimeOffList';
import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import EditCalendarIcon from '@/_icons/EditCalendarIcon';
import { AppRoutes } from '@/_routes/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '@avoo/hooks/src/useDebounce';
import { Exception } from '@avoo/axios/types/apiTypes';
import { exceptionHooks, masterHooks } from '@avoo/hooks';
import { localizationHooks } from '@/_hooks/localizationHooks';

export default function TimeOffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const DEFAULT_LIMIT = 10;
  const debouncedSearch = useDebounce(searchQuery, 400);
  const queryParams = useMemo(
    () => ({ limit: DEFAULT_LIMIT, search: debouncedSearch }),
    [debouncedSearch],
  );
  const { data, fetchNextPage, hasNextPage } = exceptionHooks.useGetExceptionsInfinite(queryParams);

  const exceptions: Exception[] = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );
  const mastersResponse = masterHooks.useGetMastersProfileInfo({ limit: 500 });
  const masters = mastersResponse?.items ?? [];

  const filteredMasters = useMemo(() => {
    if (!masters) return [];
    const query = (searchQuery ?? '').trim().toLowerCase();
    if (!query) return masters;
    return masters.filter((master) => (master.name ?? '').toLowerCase().includes(query));
  }, [masters, searchQuery]);

  const filteredExceptions = useMemo(() => {
    const queryNormalized = (searchQuery ?? '').trim();
    if (!queryNormalized) return exceptions;
    const masterIds = new Set(filteredMasters.map((master) => master.id));
    return exceptions.filter(
      (exception) => exception.masterId != null && masterIds.has(exception.masterId),
    );
  }, [exceptions, filteredMasters, searchQuery]);

  const router = useRouter();

  const handleAddTimeOff = useCallback(() => {
    router.push(localizationHooks.useWithLocale(AppRoutes.AddTimeOff));
  }, [router]);

  return (
    <AppWrapper className='flex-1 min-h-0'>
      <div className='flex-1 min-h-0 overflow-auto hide-scrollbar'>
        <Controls
          title='Schedule exception'
          onAddItem={handleAddTimeOff}
          addLabel='Add time off'
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder='Search by master`s name'
          variant={ControlsVariant.StackedSearch}
          className='sticky top-0 z-10 bg-white px-6 pt-6 lg:px-11 lg:pt-14'
        />

        <div className='px-11 pb-11'>
          {filteredExceptions.length === 0 ? (
            <AppPlaceholder
              title='No time off added yet'
              icon={<EditCalendarIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />}
              description={
                <p>
                  <Link
                    href={localizationHooks.useWithLocale(AppRoutes.AddTimeOff)}
                    className='text-primary-300 font-bold'
                  >
                    Add time off
                  </Link>
                  , vacations, breaks, or unavailable hours to keep the schedule accurate.
                </p>
              }
            />
          ) : (
            <TimeOffList
              items={filteredExceptions}
              incrementPage={fetchNextPage}
              hasMore={!!hasNextPage}
            />
          )}
        </div>
      </div>
    </AppWrapper>
  );
}
