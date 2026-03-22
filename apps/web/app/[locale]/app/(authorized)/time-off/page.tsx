'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import dayjs from 'dayjs';

import type { Exception } from '@avoo/axios/types/apiTypes';
import { exceptionHooks, exceptionUtils, useDebounce } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Controls, { ControlsVariant } from '@/_components/Controls/Controls';
import TimeOffEditModal from '@/_components/TimeOffEditModal/TimeOffEditModal';
import TimeOffList from '@/_components/TimeOffList/TimeOffList';
import { localizationHooks } from '@/_hooks/localizationHooks';
import EditCalendarIcon from '@/_icons/EditCalendarIcon';
import { AppRoutes } from '@/_routes/routes';

export default function TimeOffPage() {
  const t = useTranslations('private.timeOff');
  const isPending = useApiStatusStore((state) => state.isPending);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTimeOff, setSelectedTimeOff] = useState<Exception | null>(null);
  const DEFAULT_LIMIT = 10;
  const debouncedSearch = useDebounce(searchQuery, 400);
  const queryParams = useMemo(
    () => ({ limit: DEFAULT_LIMIT, search: debouncedSearch }),
    [debouncedSearch],
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    exceptionHooks.useGetExceptionsInfinite(queryParams);

  const exceptions: Exception[] = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  const currentAndFutureExceptions = useMemo(() => {
    const now = dayjs();

    return exceptions.filter((item) => {
      if (!item.dateTo) return true;

      const endDate = exceptionUtils.normalizeExceptionEndDate(item.dateFrom, item.dateTo);
      return !endDate.isValid() || endDate.isSame(now, 'day') || endDate.isAfter(now, 'day');
    });
  }, [exceptions]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [debouncedSearch, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (debouncedSearch.trim()) return;
    if (currentAndFutureExceptions.length > 0) return;
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [
    currentAndFutureExceptions.length,
    debouncedSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  const filteredExceptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return currentAndFutureExceptions;

    return currentAndFutureExceptions.filter((item) =>
      (item.master?.name ?? '').toLowerCase().includes(normalizedQuery),
    );
  }, [currentAndFutureExceptions, searchQuery]);

  const router = useRouter();
  const addTimeOffPath = localizationHooks.useWithLocale(AppRoutes.AddTimeOff);

  const handleAddTimeOff = useCallback(() => {
    router.push(addTimeOffPath);
  }, [router, addTimeOffPath]);

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
          title={t('scheduleException')}
          onAddItem={handleAddTimeOff}
          addLabel={t('addTimeOff')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder={t('searchByMasterName')}
          variant={ControlsVariant.StackedSearch}
          className='sticky top-0 z-10 bg-white px-5 md:px-11 lg:px-11 pt-6 lg:pt-14 lg:pb-8'
        />

        <div className='px-5 md:px-11 pb-11 lg:flex-1 lg:min-h-0 lg:overflow-hidden'>
          {filteredExceptions.length === 0 ? (
            <AppPlaceholder
              title={isPending ? t('loading') : t('noTimeOff')}
              icon={<EditCalendarIcon className='w-20 h-20 xl:w-25 xl:h-25 fill-primary-300' />}
              description={
                <p>
                  {t.rich('detailedNoTimeOffDescription', {
                    link: (chunks) => (
                      <Link href={addTimeOffPath} className='text-primary-300 font-bold'>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              }
            />
          ) : (
            <TimeOffList
              items={filteredExceptions}
              incrementPage={fetchNextPage}
              hasMore={!searchQuery.trim() && !!hasNextPage}
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
