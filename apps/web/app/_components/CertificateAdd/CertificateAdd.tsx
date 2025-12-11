'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@/_routes/routes';
import { userHooks, masterHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import SelectButton from '@/_components/SelectButton/SelectButton';

export const CertificateAdd = () => {
  const router = useRouter();
  const { handleAddCertificate } = userHooks.usePostCertificate();
  const masters = masterHooks.useGetMastersProfileInfo();

  const [ownerType, setOwnerType] = useState<'salon' | 'master'>('salon');
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [selectedMasterError, setSelectedMasterError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFilePicked = useCallback((f: File | null) => {
    if (!f) {
      setFile(null);
      setFileError(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(f.type)) {
      setFile(null);
      setFileError('Unsupported file type. Use JPG, PNG or PDF.');
      return;
    }

    if (f.size > maxSize) {
      setFile(null);
      setFileError('File is too large. Max 10MB.');
      return;
    }

    setFileError(null);
    setFile(f);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get('title') as string) ?? '';
    const description = (formData.get('description') as string) ?? '';
    const issueDate = (formData.get('issueDate') as string) ?? '';

    const payload: {
      title: string;
      description?: string;
      issueDate: string;
      masterId?: number;
      file?: File | Blob;
    } = {
      title,
      description,
      issueDate,
    };

    if (ownerType === 'master') {
      if (!selectedMasterId) {
        setSelectedMasterError('Please choose a master');
        return;
      }
      payload.masterId = selectedMasterId;
    }

    if (file) payload.file = file;

    handleAddCertificate(payload, {
      onSuccess: () => {
        form.reset();

        setOwnerType('salon');
        setSelectedMasterId(null);
        setSelectedMasterError(null);
        setFile(null);
        setFileError(null);

        if (fileInputRef.current) fileInputRef.current.value = '';
    
        router.push(appRoutes.Certificates);
      },
    });
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
        />
        <label htmlFor='description' className='block text-gray-700 font-semibold mb-2'>
          Description
        </label>
        <FormInput
          type='text'
          id='description'
          name='description'
          placeholder='Enter certificate description'
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='issueDate' className='block text-gray-700 font-semibold mb-2'>
          Issue Date
        </label>
        <input type='date' id='issueDate' name='issueDate' required />
      </div>
      <div className='mb-4'>
        <label htmlFor='masterId' className='block text-gray-700 font-semibold mb-2'>
          Master
        </label>
        <div>
          <SelectButton
            label={
              selectedMasterId
                ? (masters?.find((x) => x.id === selectedMasterId)?.name ??
                  `Master ${selectedMasterId}`)
                : 'Salon'
            }
            options={[
              {
                label: 'Salon',
                handler: () => {
                  setOwnerType('salon');
                  setSelectedMasterId(null);
                  setSelectedMasterError(null);
                },
              },
              ...((masters ?? []).map((master) => ({
                label: master.name ?? `Master ${master.id}`,
                handler: () => {
                  setOwnerType('master');
                  setSelectedMasterId(master.id);
                  setSelectedMasterError(null);
                },
              })) as { label: string; handler: () => void }[]),
            ]}
          />
          <input type='hidden' name='masterId' value={selectedMasterId ?? ''} />
          {selectedMasterError && (
            <p className='text-sm text-red-500 mt-2'>{selectedMasterError}</p>
          )}
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
          type='button'
          intent={ButtonIntent.Cancel}
          fit={ButtonFit.Inline}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type='submit' intent={ButtonIntent.Submit} fit={ButtonFit.Inline}>
          Save
        </Button>
      </div>
    </form>
  );
};
