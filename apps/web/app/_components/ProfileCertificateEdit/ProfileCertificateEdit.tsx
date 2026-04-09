'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { DATE_DISPLAY_FORMAT } from '@avoo/constants';
import { masterHooks, userHooks } from '@avoo/hooks';

import ConfirmationModal from '@/_components/ConfirmationModal/ConfirmationModal';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import { FormMultiSelect } from '@/_components/FormMultiSelect/FormMultiSelect';
import FormTextarea from '@/_components/FormTextArea/FormTextArea';
import { Modal, ModalVariant } from '@/_components/Modal/Modal';
import ModalActions from '@/_components/ModalActions/ModalActions';
import { type CertificateFormValues, OwnerType } from '@/_hooks/types/certificateType';
import { useToast } from '@/_hooks/useToast';
import DeleteIcon from '@/_icons/DeleteIcon';

import FormInput from '../FormInput/FormInput';

type ProfileCertificateEditValues = {
  title: string;
  description?: string;
  issueDate: string;
  masterId?: number | null;
};

type ProfileCertificateEditProps = {
  certificateId: number;
  open: boolean;
  onClose: () => void;
  onRequestClose?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  certificateImageUrl: string;
  initialValues: ProfileCertificateEditValues;
};

const buildCertificatePayload = (values: CertificateFormValues, certificateImageUrl: string) => ({
  title: values.title,
  description: values.description || undefined,
  issueDate: values.issueDate,
  url: certificateImageUrl,
  masterId: values.ownerType === OwnerType.Master ? (values.masterId ?? undefined) : undefined,
});

const getDefaultValues = (initialValues: ProfileCertificateEditValues): CertificateFormValues => ({
  title: initialValues.title,
  description: initialValues.description ?? '',
  issueDate: initialValues.issueDate,
  ownerType: initialValues.masterId ? OwnerType.Master : OwnerType.Salon,
  masterId: initialValues.masterId ?? null,
});

export const ProfileCertificateEdit = ({
  certificateId,
  open,
  onClose,
  onRequestClose,
  onDirtyChange,
  certificateImageUrl,
  initialValues,
}: ProfileCertificateEditProps) => {
  const t = useTranslations('private.components.CertificateAdd.CertificateAdd');
  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const toast = useToast();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const { handleUpdateCertificate, isPending } = userHooks.usePutCertificate({
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      onClose();
    },
  });

  const { handleDeleteCertificate, isPending: isDeletePending } = userHooks.useDeleteCertificate({
    onSuccess: () => {
      const certificateTitle = initialValues.title.trim() || t('certificateFallback');
      toast.info(t('certificateDeleted', { name: certificateTitle }));
      setIsDeleteConfirmOpen(false);
      onClose();
    },
  });

  const form = useForm<CertificateFormValues>({
    defaultValues: getDefaultValues(initialValues),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = form;

  React.useEffect(() => {
    if (!open) return;
    reset(getDefaultValues(initialValues));
  }, [initialValues, open, reset]);

  const masterId = watch('masterId');
  const hasChanges = isDirty;

  React.useEffect(() => {
    if (onDirtyChange) onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);

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

  const handleCancel = React.useCallback(() => {
    (onRequestClose ?? onClose)();
  }, [onRequestClose, onClose]);

  const handleFormSubmit = React.useCallback(
    (values: CertificateFormValues) => {
      handleUpdateCertificate({
        id: certificateId,
        payload: buildCertificatePayload(values, certificateImageUrl),
      });
    },
    [certificateId, certificateImageUrl, handleUpdateCertificate],
  );

  const handleDeleteClick = React.useCallback(() => {
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    handleDeleteCertificate(certificateId);
  }, [certificateId, handleDeleteCertificate]);

  return (
    <>
      <Modal isOpen={open} onClose={handleCancel} variant={ModalVariant.PANEL}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col h-full min-h-0'>
          <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4 -mr-4 pb-8'>
            <div className='space-y-6 md:space-y-8'>
              <div className='flex justify-between'>
                <h2 className='text-2xl font-bold'>
                  {t('certificates', { defaultValue: 'Certificates' })}
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
                  {...register('title', {
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
                  {...register('description', {
                    maxLength: { value: 200, message: t('maxLength200') },
                  })}
                  error={errors.description?.message}
                />
              </div>

              <div>
                <FormDatePicker
                  label={t('issuedDate', { defaultValue: 'Issued date' })}
                  date={watch('issueDate')}
                  onChange={(value) => setValue('issueDate', value, { shouldDirty: true })}
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

              <div className='space-y-4'>
                <div className='overflow-hidden rounded-lg border border-gray-200 bg-primary-50 mb-6'>
                  <img
                    src={certificateImageUrl}
                    alt={watch('title') || initialValues.title}
                    className='block h-auto w-full object-cover'
                  />
                </div>

                <div className='flex justify-end'>
                  <button
                    type='button'
                    onClick={handleDeleteClick}
                    className='inline-flex items-center gap-2 text-[12px] text-gray-600 transition-colors hover:text-red-900 cursor-pointer'
                  >
                    <span className='underline'>
                      {t('deleteCertificate', { defaultValue: 'Delete certificate' })}
                    </span>
                    <DeleteIcon className='fill-current' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ModalActions
            onCancel={handleCancel}
            cancelText={t('close', { defaultValue: 'Close' })}
            submitText={t('save', { defaultValue: 'Save' })}
            loading={isPending}
            submitDisabled={isPending || !hasChanges}
            className='justify-center'
          />
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('deleteCertificateTitle')}
        description={t('deleteDescription')}
        confirmText={t('deleteConfirm')}
        submitDisabled={isDeletePending}
      />
    </>
  );
};

export default ProfileCertificateEdit;
