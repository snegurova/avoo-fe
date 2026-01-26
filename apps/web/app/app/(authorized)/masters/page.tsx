'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@/_routes/routes';
import Controls from '@/_components/Controls/Controls';
import { IconButton } from '@/_components/IconButton/IconButton';
import { routerHooks } from '@/_hooks/routerHooks';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';

export default function MastersPage() {
  const handleBackClick = routerHooks.useHandleNavigateToHomeClick();

  const [searchQuery, setSearchQuery] = useState('');

  const masters = masterHooks.useGetMastersProfileInfo();
  const filtered = masterHooks.useFilterMasters(masters, searchQuery);

  const router = useRouter();

  const handleAddMaster = useCallback(() => {
    router.push(`${appRoutes.Masters}/add-master`);
  }, [router]);

  return (
    <AppWrapper>
      <div className='p-6 flex-1 min-h-0 overflow-auto hide-scrollbar'>
        <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />

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

        <MasterList masters={filtered} />
        
      </div>
    </AppWrapper>
  );
}
