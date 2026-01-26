'use client';

import React, { useState, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { AvatarUpload, AvatarSize } from '@/_components/AvatarUpload/AvatarUpload';
import FormInput from '@/_components/FormInput/FormInput';
import { FormMultiSelect } from '@/_components/FormMultiSelect/FormMultiSelect';
import { masterHooks } from '@avoo/hooks';
import { LANGUAGE_NAMES } from '@avoo/constants';
import { appRoutes } from '@/_routes/routes';
import { useToast } from '@/_hooks/useToast';

export default function AddMasterPage() {
  const router = useRouter();
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  const toast = useToast();
  const { control, handleSubmit, isPending } = masterHooks.useCreateMasterForm({
    onSuccess: () => {
      toast.success('New master added successfully');
      router.push(appRoutes.Masters);
    },
  });

  const onCancel = useCallback(() => {
    router.push(appRoutes.Masters);
  }, [router]);

  const onImageSelected = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setLocalAvatar(url);
  }, []);

  const languageOptions = Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({
    label: `${name} (${code.toUpperCase()})`,
    value: code,
  }));

  return (
    <AppWrapper>
      <div className='p-6 flex-1 min-h-0 overflow-auto hide-scrollbar max-w-4xl mx-auto'>
        <h2 className='text-lg font-semibold mb-4'>Add Master</h2>

        <form onSubmit={handleSubmit} className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <Typography className='text-sm text-gray-600'>Personal info</Typography>
            <div className='flex items-center gap-4'>
              <AvatarUpload
                imageUri={localAvatar}
                onImageSelected={onImageSelected}
                isLoading={false}
                size={AvatarSize.XLARGE}
                showEditIcon
              />
            </div>

            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='text-sm text-gray-600 block mb-1'>Display Name</label>
                  <FormInput id='name' {...field} />
                </div>
              )}
            />

            <Controller
              name='bio'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='text-sm text-gray-600 block mb-1'>Headline</label>
                  <FormInput id='bio' {...field} value={field.value ?? ''} />
                </div>
              )}
            />

            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='text-sm text-gray-600 block mb-1'>Email</label>
                  <FormInput id='email' type='email' {...field} />
                </div>
              )}
            />

            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='text-sm text-gray-600 block mb-1'>Phone</label>
                  <FormInput id='phone' type='tel' {...field} value={field.value ?? ''} />
                </div>
              )}
            />

            <Controller
              name='languages'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='text-sm text-gray-600 block mb-1'>Languages</label>
                  <FormMultiSelect
                    id='languages'
                    name='languages'
                    options={languageOptions}
                    selected={field.value || []}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>

          <div className='space-y-4'>
            <div>
              <label className='text-sm text-gray-600 block mb-1'>About</label>
              <Controller
                name='bio'
                control={control}
                render={({ field }) => (
                  <textarea
                    name={field.name}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    value={field.value ?? ''}
                    className='block w-full border border-gray-200 p-3 rounded-lg min-h-[120px]'
                  />
                )}
              />
            </div>

            <div className='mt-auto flex justify-end gap-3'>
              <Button
                onClick={onCancel}
                color='secondary'
                variant='outlined'
                sx={{ minWidth: 120 }}
              >
                Close
              </Button>
              <Button
                type='submit'
                color='secondary'
                variant='contained'
                sx={{ minWidth: 120 }}
                disabled={isPending}
              >
                Add
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppWrapper>
  );
}
