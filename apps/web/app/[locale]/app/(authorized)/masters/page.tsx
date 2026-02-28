'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@/_routes/routes';
import Controls from '@/_components/Controls/Controls';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';

export default function MastersPage() {

  const [searchQuery, setSearchQuery] = useState('');

  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const filtered = masterHooks.useFilterMasters(masters ?? null, searchQuery);

  const router = useRouter();

  const handleAddMaster = useCallback(() => {
    router.push(`${appRoutes.AddMaster}`);
  }, [router]);

  return (
    <AppWrapper>
      <div className='p-5 flex-1 min-h-0 overflow-auto lg:overflow-hidden hide-scrollbar flex flex-col'>

          <Controls
            title='Masters'
            onAddItem={handleAddMaster}
            addLabel='New master'
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder='Search by name, phone or email'
          />

        <div className='flex-1 min-h-0 overflow-hidden'>
          <MasterList masters={filtered} />
        </div>
      </div>
    </AppWrapper>
  );
}
