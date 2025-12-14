'use client';

import React, { useRef } from 'react';
import { Button } from '@mui/material';
import FormInput from '@/_components/FormInput/FormInput';
import SelectButton from '@/_components/SelectButton/SelectButton';
import { useApiStatusStore } from '@avoo/store';
import { useCertificateForm } from '@/_hooks/useCertificateForm';

export enum OwnerType {
  Salon = 'salon',
  Master = 'master',
}

export const CertificateAdd = () => {
  const hook = useCertificateForm();
  const { formik, masters, file, fileError, onFilePicked, onCancel } = hook;

  const isPending = useApiStatusStore((state) => state.isPending);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formik.handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-2xl font-bold mb-4'>Add Certificate</h2>
      <div className='mb-4'>
        <label htmlFor='title' className='block text-gray-700 font-semibold mb-2'>
          Title
        </label>
        <FormInput
          type='text'
          id='title'
          name='title'
          placeholder='Enter certificate title'
          required
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        <label htmlFor='description' className='block text-gray-700 font-semibold mb-2'>
          Description
        </label>
        <FormInput
          type='text'
          id='description'
          name='description'
          placeholder='Enter certificate description'
          value={formik.values.description}
          onChange={formik.handleChange}
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='issueDate' className='block text-gray-700 font-semibold mb-2'>
          Issue Date
        </label>
        <input
          type='date'
          id='issueDate'
          name='issueDate'
          required
          value={formik.values.issueDate}
          onChange={formik.handleChange}
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='masterId' className='block text-gray-700 font-semibold mb-2'>
          Master
        </label>
        <div>
          <SelectButton
            label={
              formik.values.masterId
                ? (masters?.find((x) => x.id === formik.values.masterId)?.name ??
                  `Master ${formik.values.masterId}`)
                : 'Salon'
            }
            options={[
              {
                label: 'Salon',
                handler: () => {
                  formik.setFieldValue('ownerType', OwnerType.Salon);
                  formik.setFieldValue('masterId', null);
                },
              },
              ...(masters ?? []).map((master): { label: string; handler: () => void } => ({
                label: master.name ?? `Master ${master.id}`,
                handler: () => {
                  formik.setFieldValue('ownerType', OwnerType.Master);
                  formik.setFieldValue('masterId', master.id);
                },
              })),
            ]}
          />
          <input type='hidden' name='masterId' value={formik.values.masterId ?? ''} />
          {fileError && <p className='text-sm text-red-500 mt-2'>{fileError}</p>}
        </div>
      </div>

      <div className='mb-4'>
        <button
          type='button'
          aria-label='Upload certificate file'
          className='w-full text-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer'
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer?.files?.[0] ?? null;
            onFilePicked(dropped);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className='mb-2 font-semibold'>
            {file ? file.name : 'Select a file or drag and drop here'}
          </p>
          <p className='text-sm text-gray-500 mb-4'>JPG, PNG only, file size no more than 10MB</p>
          <span className='px-4 py-2 border border-blue-300 text-blue-600 rounded-md inline-block'>
            SELECT FILE
          </span>
          <input
            id='certificateFileInput'
            ref={fileInputRef}
            name='certificateFile'
            type='file'
            accept='.jpg,.png'
            className='hidden'
            onChange={(e) => onFilePicked(e.target.files?.[0] ?? null)}
          />
          {fileError && <p className='text-sm text-red-500 mt-2'>{fileError}</p>}
        </button>
      </div>
      <div className='flex justify-center gap-3'>
        <Button
          onClick={onCancel}
          loading={isPending}
          color='secondary'
          variant='outlined'
          sx={{ minWidth: 150 }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          loading={isPending}
          color='secondary'
          variant='contained'
          sx={{ minWidth: 150 }}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
