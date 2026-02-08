import React from 'react';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import ModalActions from '../ModalActions/ModalActions';

type Props = {
  isOpen: boolean;
  onCancel?: () => void;
  onDiscard?: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  submitType?: 'submit' | 'button';
  submitDisabled?: boolean;
  contentStyle?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function ConfirmationModal({
  isOpen,
  onCancel,
  onDiscard,
  onConfirm,
  title = 'Are you sure?',
  description = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  submitType = 'button',
  submitDisabled = false,
  contentStyle,
  children,
}: Props) {
  const handleConfirm = React.useCallback(() => {
    if (onDiscard) onDiscard();
    if (onConfirm) onConfirm();
  }, [onDiscard, onConfirm]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      variant={ModalVariant.CENTER}
      contentStyle={contentStyle ?? { width: 345, height: 265 }}
    >
      {children || (
        <>
          <h3 className='text-lg font-semibold mb-6'>{title}</h3>
          {description ? <p className='text-sm text-gray-600 mb-7'>{description}</p> : null}
        </>
      )}

      <ModalActions
        onCancel={handleCancel}
        onSubmit={handleConfirm}
        cancelText={cancelText}
        submitText={confirmText}
        submitType={submitType}
        submitDisabled={submitDisabled}
        className='confirmation-modal'
      />
    </Modal>
  );
}
