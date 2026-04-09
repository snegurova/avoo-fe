'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { customerHooks } from '@avoo/hooks';

import { useToast } from '@/_hooks/useToast';
import LockIcon from '@/_icons/LockIcon';

import ClientOrdersHistory from '../ClientOrdersHistory/ClientOrdersHistory';
import FormInput, { AccessoryPosition } from '../FormInput/FormInput';
import FormTextarea from '../FormTextArea/FormTextArea';
import ModalActions from '../ModalActions/ModalActions';
import NotificationField from '../NotificationField/NotificationField';

export type FormValues = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  isNotificationEnable?: boolean;
};

type ClientFormProps = {
  initial: FormValues;
  onClose: () => void;
  onRequestClose?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  id: number | null;
  notifyInitial?: boolean;
};

export default function ClientEditForm(props: Readonly<ClientFormProps>) {
  const t = useTranslations('private.components.ClientEditForm.ClientEditForm');
  const { initial, onClose, onRequestClose, onDirtyChange, id, notifyInitial = true } = props;

  const update = customerHooks.useUpdateCustomer();

  const toast = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty: hasChanges },
  } = useForm<FormValues>({ defaultValues: { ...initial, isNotificationEnable: notifyInitial } });

  React.useEffect(() => {
    reset({ ...initial, isNotificationEnable: notifyInitial });
  }, [initial, notifyInitial, reset]);

  React.useEffect(() => {
    if (onDirtyChange) onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);

  const onSubmit = async (values: FormValues) => {
    if (id == null) {
      onClose();
      return;
    }

    const customerUpdateData = {
      name: values.name,
      phone: values.phone,
      notes: values.notes,
      isNotificationEnable: !!values.isNotificationEnable,
    };

    await update.updateCustomerAsync({ id, body: customerUpdateData });
    toast.success(t('updateSuccess'));
    onClose();
  };

  const loading = update.isPending;

  const handleCancel = React.useCallback(() => {
    (onRequestClose ?? onClose)();
  }, [onRequestClose, onClose]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex h-full min-h-0 flex-col'>
      <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4 -mr-4'>
        <div className='flex flex-col gap-11'>
          <div className='flex flex-col space-y-6'>
            <h2 className='text-lg font-semibold mb-3'>{t('clientInformation')}</h2>

            <div>
              <label htmlFor='name' className='text-sm'>
                {t('name')}
              </label>
              <FormInput id='name' {...register('name')} />
            </div>

            <div>
              <label htmlFor='email' className='text-sm'>
                {t('emailLabel')}
              </label>
              <FormInput
                id='email'
                {...register('email')}
                readOnly
                accessory={<LockIcon className='text-gray-400' />}
                accessoryPosition={AccessoryPosition.Right}
              />
            </div>

            <div>
              <label htmlFor='phone' className='text-sm'>
                {t('phone')}
              </label>
              <FormInput id='phone' {...register('phone')} />
            </div>

            <Controller
              name='notes'
              control={control}
              render={({ field }) => (
                <FormTextarea
                  {...field}
                  rows={3}
                  label={t('notes')}
                  showCounter={true}
                  textareaClassAppend='text-xs'
                />
              )}
            />

            <Controller
              name='isNotificationEnable'
              control={control}
              render={({ field }) => <NotificationField field={field} />}
            />
          </div>

          <ClientOrdersHistory customerId={id} />
        </div>
      </div>

      <ModalActions
        onCancel={handleCancel}
        submitType='submit'
        loading={loading}
        submitDisabled={!hasChanges}
        className='justify-center'
      />
    </form>
  );
}
