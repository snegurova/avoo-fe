'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@/_routes/routes';
import Controls from '@/_components/Controls/Controls';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import MasterEditModal from '@/_components/MasterEditModal/MasterEditModal';
import type { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

export default function MastersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMaster, setEditingMaster] = useState<MasterWithRelationsEntityResponse | null>(
    null,
  );

  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const filtered = masterHooks.useFilterMasters(masters ?? null, searchQuery);

  const router = useRouter();

  const handleAddMaster = useCallback(() => {
    router.push(`${appRoutes.Masters}/add-master`);
  }, [router]);

  const handleEditMaster = useCallback((master: MasterWithRelationsEntityResponse) => {
    setEditingMaster(master);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingMaster(null);
  }, []);

  return (
    <AppWrapper>
      <div className='p-6 flex-1 min-h-0 overflow-auto hide-scrollbar'>
        <div className='mb-8'>
          <Controls
            title='Masters'
            onAddItem={handleAddMaster}
            addLabel='New master'
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder='Search by name, phone or email'
          />
        </div>

        <MasterList
          masters={filtered}
          onEdit={handleEditMaster}
          selectedId={editingMaster?.id ?? null}
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
