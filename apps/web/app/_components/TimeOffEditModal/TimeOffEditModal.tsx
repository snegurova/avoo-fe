'use client';

import React from 'react';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import type { Exception } from '@avoo/axios/types/apiTypes';
import TimeOffEditForm from '../TimeOffEditForm/TimeOffEditForm';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

export type TimeOffItem = Exception;

type Props = {
  timeOff?: TimeOffItem | null;
  open: boolean;
  onClose: () => void;
};

export const TimeOffEditModal: React.FC<Props> = ({ timeOff, open, onClose }) => {
  const [isDirty, setIsDirty] = React.useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = React.useState(false);

  const handleRequestClose = React.useCallback(() => {
    if (isDirty) setShowUnsavedConfirm(true);
    else onClose();
  }, [isDirty, onClose]);

  return (
    <>
      <Modal isOpen={open && !!timeOff} onClose={handleRequestClose} variant={ModalVariant.PANEL}>
        {timeOff ? (
          <TimeOffEditForm
            timeOff={timeOff}
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
        description='You have unsaved changes. Are you sure you want to leave?'
        confirmText='Discard changes'
      />
    </>
  );
};

export default TimeOffEditModal;
