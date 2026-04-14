'use client';

import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, Typography } from '@mui/material';

import { FileEntity } from '@avoo/axios/types/apiTypes';
import { CreateMasterErrorType, masterHooks, phoneHooks } from '@avoo/hooks';

import { AvatarSize, AvatarUpload } from '@/_components/AvatarUpload/AvatarUpload';
import FormInput from '@/_components/FormInput/FormInput';
import FormLanguageSearch from '@/_components/FormLanguageSearch/FormLanguageSearch';
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';

import FormTextarea from '../FormTextArea/FormTextArea';

export default function MasterAddForm() {
  const t = useTranslations('private.components.MasterAddForm.MasterAddForm');
  const router = useRouter();
  const mastersPath = localizationHooks.useWithLocale(AppRoutes.Masters);

  const handleNavigateToMasters = useCallback(() => {
    router.push(mastersPath);
  }, [router, mastersPath]);

  const toast = useToast();
  const { control, handleSubmit, isPending, errors, setError, clearErrors } =
    masterHooks.useCreateMasterForm({
      onSuccess: () => {
        toast.success(t('addSuccess'));
        handleNavigateToMasters();
      },
      onError: (errorType) => {
        if (errorType === CreateMasterErrorType.DuplicateEmail) {
          setError('email', {
            type: 'server',
            message: t('emailAlreadyExists'),
          });
          return;
        }

        toast.error(t('defaultFailError'));
      },
    });

  const onCancel = useCallback(() => {
    handleNavigateToMasters();
  }, [handleNavigateToMasters]);

  const { field: nameField } = useController({ name: 'name', control });
  const { field: headlineField } = useController({ name: 'headline', control });
  const { field: bioField } = useController({ name: 'bio', control });
  const { field: emailField } = useController({ name: 'email', control });
  const { field: phoneField } = useController({ name: 'phone', control });

  const handleEmailChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      emailField.onChange(evt);
      clearErrors('email');
    },
    [emailField, clearErrors],
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

  const { field: languagesField, fieldState: languagesFieldState } = useController({
    name: 'languages',
    control,
  });

  const { field: avatarUrlField } = useController({ name: 'avatarUrl', control });
  const { field: avatarPreviewUrlField } = useController({ name: 'avatarPreviewUrl', control });

  const onAvatarSave = useCallback(
    (file: FileEntity) => {
      avatarUrlField.onChange(file.url);
      avatarPreviewUrlField.onChange(file.previewUrl);
    },
    [avatarUrlField, avatarPreviewUrlField],
  );

  return (
    <form onSubmit={handleSubmit} className='flex-1 flex flex-col min-h-0'>
      <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4 -mr-4'>
        <div className='space-y-6 md:space-y-8 pb-2'>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>{t('personalInfo')}</Typography>
          <div className='flex items-center gap-4 py-8 md:py-6'>
            <AvatarUpload
              imageUri={null}
              isLoading={false}
              size={AvatarSize.XLARGE}
              onAvatarSave={onAvatarSave}
              showEditIcon
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-x-6 lg:gap-y-8'>
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

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-x-6 lg:gap-y-8'>
            <div>
              <label htmlFor='email' className='text-sm block mb-1'>
                {t('email')}
              </label>
              <FormInput
                id='email'
                type='email'
                {...emailField}
                value={emailField.value ?? ''}
                onChange={handleEmailChange}
                error={errors.email?.message}
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
              classNames={{
                textarea:
                  'block w-full text-sm text-gray-600 border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-purple-800',
              }}
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
          />
        </div>
      </div>

      <div className='w-full mt-6 flex justify-between md:justify-end items-end gap-6 md:gap-8'>
        <Button
          onClick={onCancel}
          color='secondary'
          variant='outlined'
          sx={{ width: { xs: 130, md: 170 }, height: 45 }}
        >
          {t('close')}
        </Button>
        <Button
          type='submit'
          color='secondary'
          variant='contained'
          sx={{ width: { xs: 130, md: 170 }, height: 45 }}
          disabled={isPending}
        >
          {t('add')}
        </Button>
      </div>
    </form>
  );
}
