'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import type { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

import { Modal, ModalVariant } from '@/_components/Modal/Modal';

import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import MasterEditForm from '../MasterEditForm/MasterEditForm';

type Props = {
  master?: MasterWithRelationsEntityResponse | null;
  open: boolean;
  onClose: () => void;
};

export const MasterEditModal: React.FC<Props> = ({ master, open, onClose }) => {
  const t = useTranslations('private.components.MasterEditModal.MasterEditModal');
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
        title={t('unsavedChanges')}
        description={t('unsavedChangesDescription')}
        confirmText={t('discardChanges')}
      />
    </>
  );
};

export default MasterEditModal;
