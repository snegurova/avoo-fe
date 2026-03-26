'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { useQueryClient } from '@tanstack/react-query';

import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { mediaHooks, userHooks } from '@avoo/hooks';

import ConfirmationModal from '@/_components/ConfirmationModal/ConfirmationModal';
import FileUploadDropzone from '@/_components/FileUploadDropzone/FileUploadDropzone';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import ModalActions from '@/_components/ModalActions/ModalActions';
import { useToast } from '@/_hooks/useToast';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  open: boolean;
  onClose: () => void;
  medias: UploadMediaResponse[];
  userId: number | null;
};

export const ProfileGalleryAdd = ({ open, onClose, medias: initialMedias, userId }: Props) => {
  const t = useTranslations('private.components.ProfileGallery.ProfileGallery');
  const tUpload = useTranslations('private.components.ServiceGalleryUpload.ServiceGalleryUpload');
  const toast = useToast();
  const queryClient = useQueryClient();
  const [addedMedias, setAddedMedias] = React.useState<UploadMediaResponse[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = React.useState<number[]>([]);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = React.useState(false);

  const hasChanges = addedMedias.length > 0 || removedMediaIds.length > 0;

  React.useEffect(() => {
    if (open) {
      setAddedMedias([]);
      setRemovedMediaIds([]);
    }
  }, [open]);

  const addedMediaIds = React.useMemo(() => new Set(addedMedias.map((m) => m.id)), [addedMedias]);

  const visibleMedias = React.useMemo(
    () => [
      ...addedMedias,
      ...initialMedias.filter(
        (media) => !removedMediaIds.includes(media.id) && !addedMediaIds.has(media.id),
      ),
    ],
    [addedMedias, addedMediaIds, initialMedias, removedMediaIds],
  );
  const wideIndexes = React.useMemo(() => {
    const indexes = new Set<number>();
    let currentIndex = 1;
    let useShortStep = true;

    while (currentIndex < visibleMedias.length) {
      indexes.add(currentIndex);
      currentIndex += useShortStep ? 2 : 3;
      useShortStep = !useShortStep;
    }

    return indexes;
  }, [visibleMedias.length]);

  const invalidateGalleryQueries = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['user', 'media'] });
    queryClient.invalidateQueries({ queryKey: ['medias'] });
  }, [queryClient]);

  const { uploadMedia, isUploading } = mediaHooks.useUploadMedia({
    onSuccess: (data) => {
      setAddedMedias((prev) => [data, ...prev]);
      invalidateGalleryQueries();
    },
    onError: (error) => {
      toast.error(t('mediaUploadError', { error: error.message }));
    },
  });

  const { deleteMediaAsync, isPending: isDeleting } = mediaHooks.useDeleteMedia({
    onError: (error) => {
      toast.error(t('mediaDeleteError', { error: error.message }));
    },
  });

  const { handleUpdateProfileAsync, isPending: isUpdatingProfile } = userHooks.useUpdateProfile();

  const isBusy = isUploading || isDeleting || isUpdatingProfile;

  const handleFilePicked = React.useCallback(
    (file: File | null) => {
      if (!file) {
        return;
      }

      uploadMedia({
        file,
        type: MEDIA_TYPE_ENUM.USER,
      });
    },
    [uploadMedia],
  );

  const handleRemove = React.useCallback((mediaId: number) => {
    setRemovedMediaIds((prev) => (prev.includes(mediaId) ? prev : [...prev, mediaId]));
    setAddedMedias((prev) => prev.filter((media) => media.id !== mediaId));
  }, []);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const hasAddedMedias = addedMedias.length > 0;

      if (userId && removedMediaIds.length > 0) {
        await Promise.all(
          removedMediaIds.map((mediaId) =>
            deleteMediaAsync({
              mediaId,
              params: {
                type: MEDIA_TYPE_ENUM.USER,
                typeEntityId: userId,
              },
            }),
          ),
        );

        toast.info(t('mediaDeleted'));
      }

      await handleUpdateProfileAsync({ mediaIds: visibleMedias.map((media) => media.id) });

      if (hasAddedMedias) {
        toast.success(t('mediaUploaded'));
      }

      invalidateGalleryQueries();
      onClose();
    },
    [
      addedMedias,
      userId,
      removedMediaIds,
      deleteMediaAsync,
      t,
      toast,
      handleUpdateProfileAsync,
      visibleMedias,
      invalidateGalleryQueries,
      onClose,
    ],
  );

  const handleRequestClose = React.useCallback(() => {
    if (hasChanges) setIsDiscardConfirmOpen(true);
    else onClose();
  }, [hasChanges, onClose]);

  return (
    <>
      <Modal isOpen={open} onClose={handleRequestClose} variant={ModalVariant.PANEL}>
        <form onSubmit={handleSubmit} className='flex h-full min-h-0 flex-col'>
          <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4 -mr-4'>
            <div className='space-y-6 md:space-y-8'>
              <div className='flex justify-between'>
                <h2 className='text-2xl'>{t('gallery')}</h2>
              </div>

              {visibleMedias.length > 0 && (
                <ul className='grid grid-cols-3 md:grid-cols-4 grid-flow-row-dense gap-1 md:gap-2 auto-rows-[165px] md:auto-rows-[180px]'>
                  {visibleMedias.map((media, index) => (
                    <li
                      key={media.id}
                      className={`relative overflow-hidden rounded-lg group transition-opacity ${wideIndexes.has(index) ? 'col-span-2' : 'col-span-1'}`}
                    >
                      <img src={media.url} alt='media' className='w-full h-full object-cover' />

                      <button
                        onClick={() => handleRemove(media.id)}
                        className='gallery-remove-button'
                        type='button'
                      >
                        <CloseIcon fill={colors.black} width={16} height={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <FileUploadDropzone
                title={tUpload('selectOrDrag')}
                description='Upload up to 5 images (JPG, PNG, max 10MB each)'
                buttonTitle={tUpload('selectFile')}
                accept='.jpg,.png'
                onFilePicked={handleFilePicked}
                isUploading={isBusy}
                className='w-full'
              />
            </div>
          </div>

          <ModalActions
            onCancel={handleRequestClose}
            cancelText={t('close')}
            submitText={t('save')}
            loading={isBusy}
            submitDisabled={!hasChanges}
            className='justify-end'
          />
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isDiscardConfirmOpen}
        onCancel={() => setIsDiscardConfirmOpen(false)}
        onDiscard={() => {
          setIsDiscardConfirmOpen(false);
          onClose();
        }}
        title={t('unsavedChanges')}
        description={t('unsavedChangesDescription')}
        confirmText={t('discardChanges')}
      />
    </>
  );
};

export default ProfileGalleryAdd;
