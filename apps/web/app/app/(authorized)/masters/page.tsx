'use client';

import React, { useState, useCallback } from 'react';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { IconButton } from '@/_components/IconButton/IconButton';
import { routerHooks } from '@/_hooks/routerHooks';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
import SearchInput from '@/_components/SearchInput/SearchInput';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';

export default function MastersPage() {
  const handleBackClick = routerHooks.useHandleNavigateToHomeClick();

  const [searchQuery, setSearchQuery] = useState('');

  const masters = masterHooks.useGetMastersProfileInfo();
  const filtered = masterHooks.useFilterMasters(masters, searchQuery);

  const [showCreateMasterModal, setShowCreateMasterModal] = useState(false);

  const handleAddMaster = useCallback(() => {
    setShowCreateMasterModal(true);
  }, []);

  const handleCloseCreateMaster = useCallback(() => {
    setShowCreateMasterModal(false);
  }, []);

  return (
    <AppWrapper>
      <div className='p-6'>
        <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />

        <div className='flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center justify-between w-full sm:w-auto'>
            <div className='-mb-4'>
              <SectionHeader title='Masters' />
            </div>

            <div className='sm:hidden'>
              <Button
                variant='outlined'
                onClick={handleAddMaster}
                sx={{
                  color: 'var(--color-primary-700)',
                  borderColor: 'var(--color-primary-700)',
                  '&:hover': { backgroundColor: 'var(--color-primary-50)' },
                }}
              >
                New master
              </Button>
            </div>
          </div>

          <div className='w-full sm:flex-1 sm:min-w-0'>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder='Search by name, phone or email'
            />
          </div>

          <div className='hidden sm:block flex-shrink-0'>
            <Button
              variant='outlined'
              onClick={handleAddMaster}
              sx={{
                color: 'var(--color-primary-700)',
                borderColor: 'var(--color-primary-700)',
                '&:hover': { backgroundColor: 'var(--color-primary-50)' },
              }}
            >
              New master
            </Button>
          </div>
        </div>

        <MasterList masters={filtered} />

        <Dialog
          open={showCreateMasterModal}
          onClose={handleCloseCreateMaster}
          fullWidth
          maxWidth='sm'
        >
          <DialogTitle>Create master</DialogTitle>
          <DialogContent>
            <Typography variant='body2' color='textSecondary'>
              Master creation form will be implemented later.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateMaster}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </AppWrapper>
  );
}
