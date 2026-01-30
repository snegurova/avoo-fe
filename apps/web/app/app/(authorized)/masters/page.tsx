'use client';

import React, { useState, useCallback } from 'react';
import Controls from '@/_components/Controls/Controls';
import { IconButton } from '@/_components/IconButton/IconButton';
import { routerHooks } from '@/_hooks/routerHooks';
import { masterHooks } from '@avoo/hooks';
import MasterList from '@/_components/MasterList/MasterList';
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

  const masters = masterHooks.useGetMastersProfileInfo()?.items;
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
            <Button autoFocus onClick={handleCloseCreateMaster}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AppWrapper>
  );
}
