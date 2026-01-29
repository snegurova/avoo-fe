'use client';

import React, { useState, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import { AvatarUpload, AvatarSize } from '@/_components/AvatarUpload/AvatarUpload';
import FormInput from '@/_components/FormInput/FormInput';
import FormLanguageSearch from '@/_components/FormLanguageSearch/FormLanguageSearch';
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import { masterHooks, usePhoneField } from '@avoo/hooks';
import { sharedInputClass } from '@/_styles/formMixins';
import { appRoutes } from '@/_routes/routes';
import { useToast } from '@/_hooks/useToast';

export default function AddMasterForm() {
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

  const { field: nameField } = useController({ name: 'name', control });
  const { field: headlineField } = useController({ name: 'headline', control });
  const { field: bioField } = useController({ name: 'bio', control });
  const { field: emailField } = useController({ name: 'email', control });
  const { field: phoneField } = useController({ name: 'phone', control });

  const { countryCode, phoneNumber, setCountryCode, setPhoneNumber } = usePhoneField(phoneField);

  const handlePhoneCodeChange = useCallback(
    (code: string) => setCountryCode(code),
    [setCountryCode],
  );

  const handlePhoneNumberChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(evt.target.value),
    [setPhoneNumber],
  );

  const { field: languagesField, fieldState: languagesFieldState } = useController({
    name: 'languages',
    control,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className='flex-1 flex flex-col md:flex-row md:flex-wrap gap-6 md:gap-8 lg:gap-6 min-h-0'
    >
      <div className='flex-1 max-w-4xl space-y-6 md:space-y-8 xl:mx-auto'>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Personal info</Typography>
        <div className='flex items-center gap-4 py-8 md:py-6'>
          <AvatarUpload
            imageUri={localAvatar}
            onImageSelected={onImageSelected}
            isLoading={false}
            size={AvatarSize.XLARGE}
            showEditIcon
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-x-6 lg:gap-y-8'>
          <div>
            <label htmlFor='name' className='text-sm block mb-1'>Display Name</label>
            <FormInput id='name' {...nameField} classNames={{ input: sharedInputClass }} />
          </div>

          <div>
            <label htmlFor='headline' className='text-sm block mb-1'>Headline</label>
            <FormInput
              id='headline'
              {...headlineField}
              value={headlineField.value ?? ''}
              classNames={{ input: sharedInputClass }}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-x-6 lg:gap-y-8'>
          <div>
            <label htmlFor='email' className='text-sm block mb-1'>Email</label>
            <FormInput
              id='email'
              type='email'
              {...emailField}
              classNames={{ input: sharedInputClass }}
            />
          </div>

          <div>
            <label htmlFor='phone' className='text-sm block mb-1'>
              Phone
            </label>
            <div className='flex items-stretch gap-6 md:gap-8 lg:gap-6'>
              <div className='w-[84px] flex-shrink-0'>
                <PhoneCodeSelect
                  id='phone-code'
                  value={countryCode}
                  onChange={handlePhoneCodeChange}
                  className='w-full h-full'
                />
              </div>

              <div className='flex-1'>
                <FormInput
                  id='phone'
                  type='tel'
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onBlur={phoneField.onBlur}
                  classNames={{ input: sharedInputClass }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-1'>
          <label htmlFor='bio' className='text-sm'>About</label>
          <div className='text-sm text-gray-600'>{(bioField.value ?? '').length}/200</div>
        </div>
        <div>
          <textarea
            onChange={bioField.onChange}
            onBlur={bioField.onBlur}
            name={bioField.name}
            ref={bioField.ref}
            value={bioField.value ?? ''}
            className='block w-full text-sm text-gray-600 border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-purple-800'
          />
          <div className='mt-1 text-xs text-gray-500'>
            Information will display on the platform.
          </div>
        </div>

        <label htmlFor='languages' className='text-sm block mb-1'>Languages</label>
        <p className='text-xs text-gray-500'>Add languages in which the service is offered</p>
        <FormLanguageSearch
          name={languagesField.name}
          control={control}
          className='w-full'
          error={languagesFieldState.error?.message}
        />
      </div>

      <div className='w-full mt-auto flex justify-center md:justify-end items-end gap-6 md:gap-8'>
        <Button
          onClick={onCancel}
          color='secondary'
          variant='outlined'
          sx={{ width: { xs: 130, md: 170 }, height: 45 }}
        >
          Close
        </Button>
        <Button
          type='submit'
          color='secondary'
          variant='contained'
          sx={{ width: { xs: 130, md: 170 }, height: 45 }}
          disabled={isPending}
        >
          Add
        </Button>
      </div>
    </form>
  );
}
