'use client';

import React from 'react';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import { customerHooks } from '@avoo/hooks';
import type { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import ClientForm from '../ClientForm/ClientForm';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

type Props = {
  id: number | null;
  client?: CustomerInfoResponse | null;
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export const ClientEditModal: React.FC<Props> = ({ id, client, open, onClose }) => {
  const queriedCustomer = customerHooks.useGetCustomerById(id);
  const customer = client ?? queriedCustomer;
  const [isDirty, setIsDirty] = React.useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = React.useState(false);
  const notifyInitial = customer?.isNotificationEnable ?? true;

  const handleRequestClose = React.useCallback(() => {
    if (isDirty) setShowUnsavedConfirm(true);
    else onClose();
  }, [isDirty, onClose]);

  const initial = React.useMemo<FormValues>(() => {
    if (!customer) return { name: '', phone: '', email: '', notes: '' };
    return {
      name: customer.name ?? '',
      phone: customer.phone ?? '',
      email: customer.email ?? '',
      notes: typeof customer.notes === 'string' ? customer.notes : '',
    };
  }, [customer]);

  return (
    <>
      {open && (
        <Modal isOpen={open} onClose={onClose} variant={ModalVariant.PANEL}>
          <ClientForm
            initial={initial}
            onClose={onClose}
            onRequestClose={handleRequestClose}
            onDirtyChange={setIsDirty}
            id={id}
            notifyInitial={notifyInitial}
          />
        </Modal>
      )}

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
