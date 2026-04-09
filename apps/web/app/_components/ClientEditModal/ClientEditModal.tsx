'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import type { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { customerHooks } from '@avoo/hooks';

import { Modal, ModalVariant } from '@/_components/Modal/Modal';

import ClientEditForm from '../ClientEditForm/ClientEditForm';
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
  const t = useTranslations('private.components.ClientEditModal.ClientEditModal');
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
      <Modal isOpen={open} onClose={handleRequestClose} variant={ModalVariant.PANEL}>
        {open ? (
          <ClientEditForm
            initial={initial}
            onClose={onClose}
            onRequestClose={handleRequestClose}
            onDirtyChange={setIsDirty}
            id={id}
            notifyInitial={notifyInitial}
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
