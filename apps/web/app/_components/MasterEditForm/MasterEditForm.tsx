'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { AvatarUpload, AvatarSize } from '@/_components/AvatarUpload/AvatarUpload';
import FormInput from '@/_components/FormInput/FormInput';
import FormLanguageSearch from '@/_components/FormLanguageSearch/FormLanguageSearch';
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import FormTextarea from '@/_components/FormTextArea/FormTextArea';
import { masterHooks, phoneHooks } from '@avoo/hooks';
import type { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { useToast } from '@/_hooks/useToast';
import ModalActions from '../ModalActions/ModalActions';
import ShareIcon from '@/_icons/ShareIcon';
import DeleteIcon from '@/_icons/DeleteIcon';
import { IconButton } from '../IconButton/IconButton';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

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
  const toast = useToast();
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
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
      toast.success('Master updated successfully');
      onClose();
    },
  });

  const { deleteMaster, isPending: isDeletePending } = masterHooks.useDeleteMaster({
    onSuccess: () => {
      const masterName = master.name?.trim() || 'Master';
      toast.info(`Master ${masterName} was deleted!`);
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

  const onImageSelected = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setLocalAvatar(url);
  }, []);

  const { field: nameField } = useController({ name: 'name', control });
  const { field: headlineField } = useController({ name: 'headline', control });
  const { field: bioField } = useController({ name: 'bio', control });
  const { field: emailField } = useController({ name: 'email', control });
  const { field: phoneField } = useController({ name: 'phone', control });
  const { field: avatarUrlField } = useController({ name: 'avatarUrl', control });
  const { field: avatarPreviewUrlField } = useController({ name: 'avatarPreviewUrl', control });

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
    <form
      onSubmit={handleSubmit}
      className='flex-1 flex flex-col md:flex-row md:flex-wrap gap-6 md:gap-8 min-h-0'
    >
      <div className='flex-1 max-w-4xl space-y-6 md:space-y-8 xl:mx-auto'>
        <div className='flex justify-between'>
          <h2 className='text-2xl'>Masters</h2>
          <div className='flex items-center gap-2'>
            <IconButton
              ariaLabel='Share'
              icon={<ShareIcon className='fill-current' />}
              className='inline-flex items-center justify-center bg-primary-50 p-2.5 rounded-[8px] hover:bg-primary-100 focus:bg-primary-100 transition-colors'
            />
            <IconButton
              ariaLabel='Delete'
              icon={<DeleteIcon className='fill-current' />}
              onClick={handleDeleteClick}
              className='inline-flex items-center justify-center bg-primary-50 p-2.5 rounded-[8px] hover:bg-red-100 focus:bg-red-100 hover:text-red-900 focus:text-red-900 transition-colors'
            />
          </div>
        </div>
        <h3 className='text-base md:text-xl mb-0'>Personal info</h3>
        <div className='flex items-center gap-4 py-6 mb-0'>
          <AvatarUpload
            imageUri={localAvatar || avatarPreviewUrlField.value || avatarUrlField.value || null}
            onImageSelected={onImageSelected}
            isLoading={false}
            size={AvatarSize.XLARGE}
            showEditIcon
          />
        </div>

        <div className='flex flex-col gap-6 md:gap-8'>
          <div>
            <label htmlFor='name' className='text-sm block mb-1'>
              Display Name
            </label>
            <FormInput id='name' {...nameField} value={nameField.value ?? ''} />
          </div>

          <div>
            <label htmlFor='headline' className='text-sm block mb-1'>
              Headline
            </label>
            <FormInput id='headline' {...headlineField} value={headlineField.value ?? ''} />
          </div>
        </div>

        <div className='flex flex-col gap-6 md:gap-8'>
          <div>
            <label htmlFor='email' className='text-sm block mb-1'>
              Email *
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
              Phone
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
            label='About'
            helperText='Information will display on the platform.'
            maxLength={200}
            classNames={{
              textarea:
                'block w-full text-sm text-gray-600 border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-purple-800',
            }}
          />
        </div>

        <label htmlFor='languages' className='text-sm block mb-1'>
          Languages
        </label>
        <p className='text-xs text-gray-500'>Add languages in which the service is offered</p>
        <FormLanguageSearch
          name={languagesField.name}
          control={control}
          className='w-full'
          error={languagesFieldState.error?.message}
          splitOnDesktop={false}
        />
      </div>

      <ModalActions
        onCancel={handleCancel}
        submitType='submit'
        loading={isPending}
        submitDisabled={!hasChanges}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete master'
        description='Are you sure you want to permanently delete this master profile? All related information will be removed and cannot be recovered.'
        confirmText='Delete master'
        submitDisabled={isDeletePending}
      />
    </form>
  );
}
