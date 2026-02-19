'use client';

import React from 'react';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import type { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import MasterEditForm from '../MasterEditForm/MasterEditForm';

type Props = {
  master?: MasterWithRelationsEntityResponse | null;
  open: boolean;
  onClose: () => void;
};

export const MasterEditModal: React.FC<Props> = ({ master, open, onClose }) => {
  return (
    <>
      {open && master && (
        <Modal isOpen={open} onClose={onClose} variant={ModalVariant.PANEL}>
          <MasterEditForm master={master} onClose={onClose} />
        </Modal>
      )}
    </>
  );
};

export default MasterEditModal;
