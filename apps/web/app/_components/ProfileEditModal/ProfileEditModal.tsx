'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { UpdateProfile } from '@avoo/axios/types/apiTypes';
import { userHooks } from '@avoo/hooks';

import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import ProfileEditForm from '../ProfileEdit/ProfileEditForm';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ProfileEditModal: React.FC<Props> = ({ open, onClose }) => {
  const t = useTranslations('private.components.MasterEditModal.MasterEditModal');
  const router = useRouter();
  const [isDirty, setIsDirty] = React.useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = React.useState(false);
  const { handleUpdateProfile, handleUpdateProfileAsync, isPending } = userHooks.useUpdateProfile();
  const { visualProfileInfo, userId } = userHooks.useGetUserProfile();
  const publicSalonPath = localizationHooks.useWithLocale(AppRoutes.PublicSalon);

  const handleRequestClose = React.useCallback(() => {
    if (isDirty) setShowUnsavedConfirm(true);
    else onClose();
  }, [isDirty, onClose]);

  const handleSubmit = async (payload: UpdateProfile) => {
    if (handleUpdateProfileAsync) {
      await handleUpdateProfileAsync(payload);
    } else {
      handleUpdateProfile(payload);
    }

    onClose();
  };

  const handleNavigateToPreview = React.useCallback(() => {
    if (!userId) return;
    router.push(`${publicSalonPath}/${userId}`);
  }, [publicSalonPath, router, userId]);

  return (
    <>
      <Modal isOpen={open} onClose={handleRequestClose} variant={ModalVariant.PANEL}>
        <ProfileEditForm
          initial={{
            name: visualProfileInfo?.name ?? null,
            headline: visualProfileInfo?.headline ?? undefined,
            policy: visualProfileInfo?.policy ?? undefined,
            email: visualProfileInfo?.email ?? undefined,
            phone: visualProfileInfo?.phone ?? null,
            description: visualProfileInfo?.description ?? null,
            address: visualProfileInfo?.address ?? null,
            location_lat: visualProfileInfo?.location_lat ?? null,
            location_lon: visualProfileInfo?.location_lon ?? null,
            avatarPreviewUrl: visualProfileInfo?.avatarPreviewUrl ?? undefined,
            avatarUrl: visualProfileInfo?.avatarUrl ?? undefined,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          onRequestClose={handleRequestClose}
          onDirtyChange={setIsDirty}
          isPending={isPending}
          onPreview={handleNavigateToPreview}
          previewDisabled={!userId}
        />
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

export default ProfileEditModal;
