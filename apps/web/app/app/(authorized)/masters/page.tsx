'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { IconButton } from '@/_components/IconButton/IconButton';
import { routerHooks } from '@/_hooks/routerHooks';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
import SearchInput from '@/_components/SearchInput/SearchInput';
import { Button } from '@mui/material';
import { appRoutes } from '@/_routes/routes';

export default function MastersPage() {
  const handleBackClick = routerHooks.useHandleNavigateToHomeClick();

  const [searchQuery, setSearchQuery] = useState('');

  const masters = masterHooks.useGetMastersProfileInfo();
  const filtered = masterHooks.useFilterMasters(masters, searchQuery);

  const handleNew = () => {
    // No dedicated add-master route yet — reuse Masters route as placeholder
    // or adapt when add route is available.
    // Navigate to masters page (current) to avoid errors.
    window.location.href = appRoutes.Masters;
  };

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />

      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex items-center justify-between mb-4 gap-4'>
          <SectionHeader title='Masters' />
          <div className='flex-1'>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder='Search master name'
            />
          </div>
          <div>
            <Button variant='outlined' onClick={handleNew}>
              New master&nbsp;+
            </Button>
          </div>
        </div>

        <MasterList masters={filtered} />
      </div>
    </div>
  );
}
