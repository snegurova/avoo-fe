'use client';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Controls, { ControlsVariant } from '@/_components/Controls/Controls';
import TimeOffList from '@/_components/TimeOffList/TimeOffList';
import TimeOffEditModal from '@/_components/TimeOffEditModal/TimeOffEditModal';
import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import EditCalendarIcon from '@/_icons/EditCalendarIcon';
import { appRoutes } from '@/_routes/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '@avoo/hooks/src/useDebounce';
import { Exception } from '@avoo/axios/types/apiTypes';
import { exceptionHooks, masterHooks } from '@avoo/hooks';

export default function TimeOffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTimeOff, setSelectedTimeOff] = useState<Exception | null>(null);
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
    router.push(`${appRoutes.AddTimeOff}`);
  }, [router]);

  const handleEditTimeOff = useCallback((timeOff: Exception) => {
    setSelectedTimeOff(timeOff);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedTimeOff(null);
  }, []);

  return (
    <AppWrapper className='flex-1 min-h-0'>
      <div className='flex-1 min-h-0 overflow-auto lg:overflow-hidden hide-scrollbar flex flex-col'>
        <Controls
          title='Schedule exception'
          onAddItem={handleAddTimeOff}
          addLabel='Add time off'
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder='Search by master`s name'
          variant={ControlsVariant.StackedSearch}
          className='sticky top-0 z-10 bg-white px-5 md:px-11 lg:px-11 pt-6 lg:pt-14 lg:pb-8'
        />

        <div className='px-5 md:px-11 pb-11 lg:flex-1 lg:min-h-0 lg:overflow-hidden'>
          {filteredExceptions.length === 0 ? (
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
            <TimeOffList
              items={filteredExceptions}
              incrementPage={fetchNextPage}
              hasMore={!!hasNextPage}
              onEdit={handleEditTimeOff}
            />
          )}
        </div>
      </div>

      <TimeOffEditModal
        timeOff={selectedTimeOff}
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
    </AppWrapper>
  );
}
