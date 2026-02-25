'use client';

import React from 'react';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import type { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import MasterEditForm from '../MasterEditForm/MasterEditForm';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

type Props = {
  master?: MasterWithRelationsEntityResponse | null;
  open: boolean;
  onClose: () => void;
};

export const MasterEditModal: React.FC<Props> = ({ master, open, onClose }) => {
  const [isDirty, setIsDirty] = React.useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = React.useState(false);

  const handleRequestClose = React.useCallback(() => {
    if (isDirty) setShowUnsavedConfirm(true);
    else onClose();
  }, [isDirty, onClose]);

  return (
    <>
      <Modal isOpen={open && !!master} onClose={handleRequestClose} variant={ModalVariant.PANEL}>
        {master ? (
          <MasterEditForm
            master={master}
            onClose={onClose}
            onRequestClose={handleRequestClose}
            onDirtyChange={setIsDirty}
          />
        ) : null}
      </Modal>

      <ConfirmationModal
        isOpen={showUnsavedConfirm}
        onCancel={() => setShowUnsavedConfirm(false)}
        onDiscard={() => {
          setShowUnsavedConfirm(false);
          onClose();
        }}
        title='Unsaved changes'
        description='You having unsaved changes. Are you sure you want to leave?'
        confirmText='Discard changes'
      />
    </>
  );
};

export default MasterEditModal;
