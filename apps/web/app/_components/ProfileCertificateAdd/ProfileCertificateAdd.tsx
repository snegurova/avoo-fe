'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import dayjs from 'dayjs';

import { DATE_DISPLAY_FORMAT } from '@avoo/constants';
import { useApiStatusStore } from '@avoo/store';

import ConfirmationModal from '@/_components/ConfirmationModal/ConfirmationModal';
import FileUploadDropzone from '@/_components/FileUploadDropzone/FileUploadDropzone';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import { FormMultiSelect } from '@/_components/FormMultiSelect/FormMultiSelect';
import FormTextarea from '@/_components/FormTextArea/FormTextArea';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import ModalActions from '@/_components/ModalActions/ModalActions';
import { OwnerType } from '@/_hooks/types/certificateType';
import { useCertificateForm } from '@/_hooks/useCertificateForm';

import FormInput from '../FormInput/FormInput';

type ProfileCertificateAddProps = { open: boolean; onClose: () => void };

export const ProfileCertificateAdd = ({ open, onClose }: ProfileCertificateAddProps) => {
  const t = useTranslations('private.components.CertificateAdd.CertificateAdd');
  const hook = useCertificateForm(onClose);
  const { form, handleSubmit, setValue, watch, masters, file, fileError, onFilePicked } = hook;
  const isPending = useApiStatusStore((state) => state.isPending);
  const masterId = watch('masterId');
  const {
    formState: { errors, isDirty },
  } = form;

  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = React.useState(false);
  const hasChanges = isDirty || !!file;

  React.useEffect(() => {
    if (open && !form.getValues('issueDate')) {
      setValue('issueDate', dayjs().format(DATE_DISPLAY_FORMAT));
    }
  }, [form, open, setValue]);

  const handleDiscardAndClose = React.useCallback(() => {
    form.reset({
      title: '',
      description: '',
      issueDate: dayjs().format(DATE_DISPLAY_FORMAT),
      ownerType: OwnerType.Salon,
      masterId: null,
    });
    onFilePicked(null);
    setIsDiscardConfirmOpen(false);
    onClose();
  }, [form, onClose, onFilePicked]);

  const handleRequestClose = React.useCallback(() => {
    if (hasChanges) {
      setIsDiscardConfirmOpen(true);
      return;
    }

    onClose();
  }, [hasChanges, onClose]);

  const masterOptions = React.useMemo(
    () =>
      (masters ?? []).map((master) => ({
        label: master.name ?? `Master ${master.id}`,
        value: String(master.id),
      })),
    [masters],
  );

  const selectedMasterValues = React.useMemo(
    () => (masterId ? [String(masterId)] : []),
    [masterId],
  );

  const handleMasterChange = React.useCallback(
    (selectedValues: string[]) => {
      const selectedMaster = [...selectedValues].pop();
      if (!selectedMaster) {
        setValue('ownerType', OwnerType.Salon, { shouldDirty: true });
        setValue('masterId', null, { shouldDirty: true });
        return;
      }

      const parsedMasterId = Number(selectedMaster);
      setValue('ownerType', OwnerType.Master, { shouldDirty: true });
      setValue('masterId', Number.isNaN(parsedMasterId) ? null : parsedMasterId, {
        shouldDirty: true,
      });
    },
    [setValue],
  );

  return (
    <>
      <Modal isOpen={open} onClose={handleRequestClose} variant={ModalVariant.PANEL}>
        <form onSubmit={handleSubmit} className='flex flex-col h-full min-h-0'>
          <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4 -mr-4'>
            <div className='space-y-6 md:space-y-8'>
              <div className='flex justify-between'>
                <h2 className='text-2xl font-bold'>
                  {t('addNewCertificate', { defaultValue: 'Add new certificate' })}
                </h2>
              </div>
              <div>
                <label htmlFor='title' className='block text-[14px] font-medium mb-1'>
                  {t('title', { defaultValue: 'Title' })}
                </label>
                <FormInput
                  id='title'
                  type='text'
                  placeholder={t('titlePlaceholder', { defaultValue: 'Title of certificate' })}
                  error={errors.title?.message}
                  {...form.register('title', {
                    required: t('titleRequired'),
                    minLength: { value: 2, message: t('titleTooShort') },
                  })}
                />
              </div>
              <div>
                <FormTextarea
                  label={
                    <span className='text-[14px] font-medium'>
                      {t('description', { defaultValue: 'Description' })}
                    </span>
                  }
                  id='description'
                  rows={3}
                  placeholder={t('descriptionPlaceholder', {
                    defaultValue: 'Add certificate details',
                  })}
                  maxLength={200}
                  showCounter
                  {...form.register('description', {
                    maxLength: { value: 200, message: t('maxLength200') },
                  })}
                  error={errors.description?.message}
                />
              </div>
              <div>
                <FormDatePicker
                  label={t('issuedDate', { defaultValue: 'Issued date' })}
                  date={form.watch('issueDate')}
                  onChange={(val) => setValue('issueDate', val, { shouldDirty: true })}
                  error={errors.issueDate?.message}
                  format={DATE_DISPLAY_FORMAT}
                  disablePast={false}
                />
              </div>
              <div>
                <label className='block text-[14px] font-medium mb-1'>
                  {t('master', { defaultValue: 'Master' })}
                </label>
                <FormMultiSelect
                  id='masterId'
                  name='masterId'
                  placeholder={t('selectMaster', { defaultValue: 'Select master' })}
                  options={masterOptions}
                  selected={selectedMasterValues}
                  onChange={handleMasterChange}
                />
              </div>
              <div>
                <FileUploadDropzone
                  title={
                    file
                      ? file.name
                      : t('fileDropzoneTitle', {
                          defaultValue: 'Select a file or drag and drop here',
                        })
                  }
                  description={t('fileDropzoneDescription', {
                    defaultValue: 'Upload up to 5 images (JPG, PNG, max 10MB each)',
                  })}
                  buttonTitle={t('fileDropzoneButton', { defaultValue: 'Select file' })}
                  accept='.jpg,.png'
                  onFilePicked={onFilePicked}
                  isUploading={isPending}
                  fileError={fileError}
                  className='w-full'
                />
              </div>
            </div>
          </div>
          <ModalActions
            onCancel={handleRequestClose}
            cancelText={t('close', { defaultValue: 'Close' })}
            submitText={t('save', { defaultValue: 'Save' })}
            loading={isPending}
            submitDisabled={isPending || !hasChanges}
            className='justify-center mt-2'
          />
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isDiscardConfirmOpen}
        onCancel={() => setIsDiscardConfirmOpen(false)}
        onDiscard={handleDiscardAndClose}
        title={t('unsavedChanges')}
        description={t('unsavedChangesDescription')}
        confirmText={t('discardChanges')}
      />
    </>
  );
};
