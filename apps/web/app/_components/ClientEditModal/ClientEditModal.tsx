'use client';

import React from 'react';
import { Modal } from '@/_components/Modal/Modal';
import { customerHooks } from '@avoo/hooks';
import { useForm } from 'react-hook-form';
import FormInput from '../FormInput/FormInput';
import { Button } from '@mui/material';

type Props = {
  id: number | null;
  open: boolean;
  onClose: () => void;
};

export const ClientEditModal: React.FC<Props> = ({ id, open, onClose }) => {
  const customer = customerHooks.useGetCustomerById(id);

  const update = customerHooks.useUpdateCustomer();

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
        <Modal isOpen={open} onClose={onClose}>
          <div className='p-4'>
            <h2 className='text-lg font-semibold mb-3'>Edit client</h2>
            <ClientForm initial={initial} onClose={onClose} id={id} update={update} />
          </div>
        </Modal>
      )}
    </>
  );
};

type FormValues = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

function ClientForm({
  initial,
  onClose,
  id,
  update,
}: {
  initial: FormValues;
  onClose: () => void;
  id: number | null;
  update: ReturnType<typeof customerHooks.useUpdateCustomer>;
}) {
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: initial });

  React.useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  const onSubmit = async (values: FormValues) => {
    if (id == null) {
      onClose();
      return;
    }

    await update.updateCustomerAsync({ id, body: values });
    onClose();
  };

  const loading = update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
      <label className='text-sm'>Name</label>
      <FormInput {...register('name')} />

      <label className='text-sm'>Phone</label>
      <FormInput {...register('phone')} />

      <label className='text-sm'>Email</label>
      <FormInput {...register('email')} />

      <label className='text-sm'>Notes</label>
      <textarea
        className='mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 sm:text-sm'
        {...register('notes')}
        rows={4}
      />

      <div className='flex justify-between mt-2'>
        <Button onClick={onClose} color='secondary' variant='outlined' sx={{ minWidth: 150 }}>
          Cancel
        </Button>
        <Button
          type='submit'
          color='secondary'
          variant='contained'
          sx={{ minWidth: 150 }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
