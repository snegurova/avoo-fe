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

export default function MastersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const DEFAULT_LIMIT = 10;
  const [editingMaster, setEditingMaster] = useState<MasterWithRelationsEntityResponse | null>(
    null,
  );

  const queryParams = useMemo(() => ({ limit: DEFAULT_LIMIT }), []);
  const { data, fetchNextPage, hasNextPage } = masterHooks.useGetMastersInfinite(queryParams);

  const masters = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );
  const filtered = masterHooks.useFilterMasters(masters ?? null, searchQuery);

  const router = useRouter();

  const handleAddMaster = useCallback(() => {
    router.push(`${localizationHooks.useWithLocale(AppRoutes.AddMaster)}`);
  }, [router]);

  const handleEditMaster = useCallback((master: MasterWithRelationsEntityResponse) => {
    setEditingMaster(master);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingMaster(null);
  }, []);

  return (
    <AppWrapper className='flex-1 min-h-0'>
      <div className='p-6 flex-1 min-h-0 overflow-auto hide-scrollbar'>
        <Controls
          title='Masters'
          onAddItem={handleAddMaster}
          addLabel='New master'
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder='Search by name, phone or email'
          className='mb-8 sticky top-0 z-10 bg-white px-6 pt-6 lg:px-11 lg:pt-14'
        />

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
    </AppWrapper>
  );
}
