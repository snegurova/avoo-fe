'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/_routes/routes';
import Controls from '@/_components/Controls/Controls';
import { IconButton } from '@/_components/IconButton/IconButton';
import { routerHooks } from '@/_hooks/routerHooks';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { localizationHooks } from '@/_hooks/localizationHooks';

export default function MastersPage() {
  const handleBackClick = routerHooks.useHandleNavigateToHomeClick();

  const [searchQuery, setSearchQuery] = useState('');

  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const filtered = masterHooks.useFilterMasters(masters ?? null, searchQuery);

  const router = useRouter();

  const handleAddMaster = useCallback(() => {
    router.push(localizationHooks.useWithLocale(AppRoutes.AddMaster));
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
