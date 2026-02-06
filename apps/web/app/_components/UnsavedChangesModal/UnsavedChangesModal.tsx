import React from 'react';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import ModalActions from '../ModalActions/ModalActions';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onDiscard: () => void;
  title?: string;
  description?: string;
};

export default function UnsavedChangesModal({
  isOpen,
  onCancel,
  onDiscard,
  title = 'Unsaved changes',
  description = 'You having unsaved changes. Are you sure you want to leave?',
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      variant={ModalVariant.CENTER}
      contentStyle={{ width: 345, height: 265 }}
    >
    
          <h3 className='text-lg font-semibold mb-6'>{title}</h3>
          <p className='text-sm text-gray-600 mb-7'>{description}</p>

        <ModalActions
          onCancel={onCancel}
          onSubmit={onDiscard}
          cancelText='Cancel'
          submitText='Discard changes'
          submitType='button'
          submitDisabled={false}
          minWidth='auto'
        />
     
    </Modal>
  );
}
