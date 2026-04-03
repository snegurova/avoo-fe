'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { masterHooks, useDebounce } from '@avoo/hooks';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Controls, { ControlsVariant } from '@/_components/Controls/Controls';
import MasterEditModal from '@/_components/MasterEditModal/MasterEditModal';
import MasterList from '@/_components/MasterList/MasterList';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function MastersPage() {
  const t = useTranslations('private.masters');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(undefined);
  const DEFAULT_LIMIT = 10;
  const debouncedSearch = useDebounce(searchQuery);
  const [editingMaster, setEditingMaster] = useState<MasterWithRelationsEntityResponse | null>(
    null,
  );

  const queryParams = useMemo(
    () => ({ limit: DEFAULT_LIMIT, search: debouncedSearch || undefined, sort: sortDirection }),
    [debouncedSearch, sortDirection],
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
          title={t('masters')}
          onAddItem={handleAddMaster}
          addLabel={t('newMaster')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder={t('searchNamePhoneEmail')}
          variant={ControlsVariant.Default}
          className='sticky top-0 z-10 bg-white px-5 md:px-11 lg:px-11 pt-6 lg:pt-14 lg:pb-8'
        />

        <div className='px-5 md:px-11 pb-11 lg:flex-1 lg:min-h-0 lg:overflow-hidden'>
          <MasterList
            masters={filtered}
            onEdit={handleEditMaster}
            selectedId={editingMaster?.id ?? null}
            incrementPage={fetchNextPage}
            hasMore={!!hasNextPage}
            sortDirection={sortDirection ?? null}
            onSortChange={setSortDirection}
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
