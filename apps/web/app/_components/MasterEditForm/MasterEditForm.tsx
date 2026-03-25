'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import type { FileEntity, MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { masterHooks, phoneHooks } from '@avoo/hooks';

import { AvatarSize, AvatarUpload } from '@/_components/AvatarUpload/AvatarUpload';
import FormInput from '@/_components/FormInput/FormInput';
import FormLanguageSearch from '@/_components/FormLanguageSearch/FormLanguageSearch';
import FormTextarea from '@/_components/FormTextArea/FormTextArea';
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import { useToast } from '@/_hooks/useToast';
import DeleteIcon from '@/_icons/DeleteIcon';
import ShareIcon from '@/_icons/ShareIcon';

import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { IconButton } from '../IconButton/IconButton';
import ModalActions from '../ModalActions/ModalActions';

type Props = {
  master: MasterWithRelationsEntityResponse;
  onClose: () => void;
  onRequestClose?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

export default function MasterEditForm({
  master,
  onClose,
  onRequestClose,
  onDirtyChange,
}: Readonly<Props>) {
  const t = useTranslations('private.components.MasterEditForm.MasterEditForm');
  const toast = useToast();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    control,
    handleSubmit,
    isPending,
    reset,
    isDirty: hasChanges,
  } = masterHooks.useUpdateMasterForm({
    master,
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      onClose();
    },
  });

  const { deleteMaster, isPending: isDeletePending } = masterHooks.useDeleteMaster({
    onSuccess: () => {
      const masterName = master.name?.trim() || t('masterFallback');
      toast.info(t('masterDeleted', { name: masterName }));
      setIsDeleteConfirmOpen(false);
      onClose();
    },
  });

  const handleCancel = useCallback(() => {
    (onRequestClose ?? onClose)();
  }, [onRequestClose, onClose]);

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);

  useEffect(() => {
    reset({
      email: master.email || '',
      name: master.name || '',
      bio: master.bio || '',
      headline: master.headline || '',
      avatarUrl: master.avatarUrl || '',
      avatarPreviewUrl: master.avatarPreviewUrl || '',
      phone: master.phone || '',
      languages: master.languages || [],
    });
  }, [master, reset]);

  const { field: nameField } = useController({ name: 'name', control });
  const { field: headlineField } = useController({ name: 'headline', control });
  const { field: bioField } = useController({ name: 'bio', control });
  const { field: emailField } = useController({ name: 'email', control });
  const { field: phoneField } = useController({ name: 'phone', control });
  const { field: avatarUrlField } = useController({ name: 'avatarUrl', control });
  const { field: avatarPreviewUrlField } = useController({ name: 'avatarPreviewUrl', control });

  const onAvatarSave = useCallback(
    (file: FileEntity) => {
      avatarUrlField.onChange(file.url);
      avatarPreviewUrlField.onChange(file.previewUrl);
    },
    [avatarUrlField, avatarPreviewUrlField],
  );

  const { countryCode, phoneNumber, setCountryCode, setPhoneNumber } =
    phoneHooks.usePhoneField(phoneField);

  const handlePhoneCodeChange = useCallback(
    (code: string) => setCountryCode(code),
    [setCountryCode],
  );

  const handlePhoneNumberChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(evt.target.value),
    [setPhoneNumber],
  );

  const handleDeleteClick = useCallback(() => {
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteMaster(master.id);
  }, [deleteMaster, master.id]);

  const { field: languagesField, fieldState: languagesFieldState } = useController({
    name: 'languages',
    control,
  });

  return (
    <form onSubmit={handleSubmit} className='flex h-full min-h-0 flex-col'>
      <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4 -mr-4'>
        <div className='max-w-4xl space-y-6 md:space-y-8 xl:mx-auto'>
          <div className='flex justify-between'>
            <h2 className='text-2xl'>{t('masters')}</h2>
            <div className='flex items-center gap-2'>
              <IconButton
                ariaLabel={t('share')}
                icon={<ShareIcon className='fill-current' />}
                className='inline-flex items-center justify-center bg-primary-50 p-2.5 rounded-[8px] hover:bg-primary-100 focus:bg-primary-100 transition-colors'
              />
              <IconButton
                ariaLabel={t('delete')}
                icon={<DeleteIcon className='fill-current' />}
                onClick={handleDeleteClick}
                className='inline-flex items-center justify-center bg-primary-50 p-2.5 rounded-[8px] hover:bg-red-100 focus:bg-red-100 hover:text-red-900 focus:text-red-900 transition-colors'
              />
            </div>
          </div>
          <h3 className='text-base md:text-xl mb-0'>{t('personalInfo')}</h3>
          <div className='flex items-center gap-4 py-6 mb-0'>
            <AvatarUpload
              imageUri={avatarPreviewUrlField.value ?? avatarUrlField.value}
              onAvatarSave={onAvatarSave}
              isLoading={false}
              size={AvatarSize.XLARGE}
              showEditIcon
            />
          </div>

          <div className='flex flex-col gap-6 md:gap-8'>
            <div>
              <label htmlFor='name' className='text-sm block mb-1'>
                {t('displayName')}
              </label>
              <FormInput id='name' {...nameField} value={nameField.value ?? ''} />
            </div>

            <div>
              <label htmlFor='headline' className='text-sm block mb-1'>
                {t('headline')}
              </label>
              <FormInput id='headline' {...headlineField} value={headlineField.value ?? ''} />
            </div>
          </div>

          <div className='flex flex-col gap-6 md:gap-8'>
            <div>
              <label htmlFor='email' className='text-sm block mb-1'>
                {t('email')}
              </label>
              <FormInput
                id='email'
                type='email'
                {...emailField}
                value={emailField.value ?? ''}
                required
              />
            </div>

            <div>
              <label htmlFor='phone' className='text-sm block mb-1'>
                {t('phone')}
              </label>
              <div className='flex items-stretch gap-3'>
                <div className='w-[84px] flex-shrink-0'>
                  <PhoneCodeSelect
                    id='phone-code'
                    value={countryCode}
                    onChange={handlePhoneCodeChange}
                  />
                </div>

                <div className='flex-1'>
                  <FormInput
                    id='phone'
                    type='tel'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    onBlur={phoneField.onBlur}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <FormTextarea
              id='bio'
              name={bioField.name}
              value={bioField.value ?? ''}
              onChange={bioField.onChange}
              onBlur={bioField.onBlur}
              ref={bioField.ref}
              label={t('about')}
              helperText={t('infoDisplayPlatform')}
              maxLength={200}
              textareaClassAppend='text-gray-600 p-3 min-h-[70px]'
            />
          </div>

          <label htmlFor='languages' className='text-sm block mb-1'>
            {t('languages')}
          </label>
          <p className='text-xs text-gray-500'>{t('addLanguagesOffer')}</p>
          <FormLanguageSearch
            name={languagesField.name}
            control={control}
            className='w-full'
            error={languagesFieldState.error?.message}
            splitOnDesktop={false}
          />
        </div>
      </div>

      <ModalActions
        onCancel={handleCancel}
        submitType='submit'
        loading={isPending}
        submitDisabled={!hasChanges}
        className='justify-end'
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('deleteMaster')}
        description={t('deleteDescription')}
        confirmText={t('deleteConfirm')}
        submitDisabled={isDeletePending}
      />
    </form>
  );
}
