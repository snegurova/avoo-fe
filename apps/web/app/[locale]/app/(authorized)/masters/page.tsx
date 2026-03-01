'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/_routes/routes';
import Controls from '@/_components/Controls/Controls';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { localizationHooks } from '@/_hooks/localizationHooks';
import MasterEditModal from '@/_components/MasterEditModal/MasterEditModal';
import type { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { useDebounce } from '@avoo/hooks/src/useDebounce';

export default function MastersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const DEFAULT_LIMIT = 10;
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [editingMaster, setEditingMaster] = useState<MasterWithRelationsEntityResponse | null>(
    null,
  );

  const queryParams = useMemo(
    () => ({ limit: DEFAULT_LIMIT, search: debouncedSearch }),
    [debouncedSearch],
  );
  const { data, fetchNextPage, hasNextPage } = masterHooks.useGetMastersInfinite(queryParams);

  const masters = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );
  const filtered = masters;

  const router = useRouter();
  const addMasterPath = localizationHooks.useWithLocale(AppRoutes.AddMaster);
  const handleNavigateToAddMaster = useCallback(() => {
    router.push(addMasterPath);
  }, [router, addMasterPath]);

  const handleAddMaster = useCallback(() => {
    handleNavigateToAddMaster();
  }, [handleNavigateToAddMaster]);

  const handleEditMaster = useCallback((master: MasterWithRelationsEntityResponse) => {
    setEditingMaster(master);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingMaster(null);
  }, []);

  return (
    <AppWrapper>
      <div className='flex-1 min-h-0 overflow-auto lg:overflow-hidden hide-scrollbar flex flex-col'>
        <Controls
          title='Masters'
          onAddItem={handleAddMaster}
          addLabel='New master'
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder='Search by name, phone or email'
          className='sticky top-0 z-10 bg-white px-5 md:px-11 lg:px-11 pt-6 lg:pt-14 lg:pb-8'
        />

        <div className='px-5 md:px-11 pb-11 lg:flex-1 lg:min-h-0 lg:overflow-hidden'>
          <MasterList
            masters={filtered}
            onEdit={handleEditMaster}
            selectedId={editingMaster?.id ?? null}
            incrementPage={fetchNextPage}
            hasMore={!!hasNextPage}
          />

          <MasterEditModal
            master={editingMaster}
            open={editingMaster !== null}
            onClose={handleCloseEdit}
          />
        </div>
      </div>
    </AppWrapper>
  );
}
