'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Button as MuiButton } from '@mui/material';

import type { FileEntity, UpdateProfile } from '@avoo/axios/types/apiTypes';
import {
  buildUpdateProfilePayload,
  createProfileDefaults,
  phoneHooks,
  useAddressSearch,
  useServerFormErrors,
} from '@avoo/hooks';
import type { NominatimPlace, VisualProfileInfo } from '@avoo/shared';
import { buildShortAddress, getCondensedAddress } from '@avoo/shared';

import { AvatarSize, AvatarUpload } from '@/_components/AvatarUpload/AvatarUpload';
import { Button, ButtonFit, ButtonRadius, ButtonSize } from '@/_components/Button/Button';
import FormInput, { AccessoryPosition } from '@/_components/FormInput/FormInput';
import FormTextarea from '@/_components/FormTextArea/FormTextArea';
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import AddPhotoIcon from '@/_icons/AddPhotoIcon';
import LockIcon from '@/_icons/LockIcon';
import PinDropIcon from '@/_icons/PinDropIcon';

import AddressResults from './AddressResults';

type Props = {
  initial?: VisualProfileInfo | null;
  onSubmit: (payload: UpdateProfile) => Promise<unknown>;
  onCancel: () => void;
  onRequestClose?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  isPending?: boolean;
  onPreview?: () => void;
  previewDisabled?: boolean;
};

export default function ProfileEditForm({
  initial,
  onSubmit,
  onCancel,
  onRequestClose,
  onDirtyChange,
  isPending,
  onPreview,
  previewDisabled,
}: Readonly<Props>) {
  const t = useTranslations('private.components.ProfileEdit.EditProfileForm');
  const { search, searchResults, clear, getMyLocation } = useAddressSearch();

  type FormValues = {
    name: string;
    headline: string;
    policy?: string;
    email: string;
    phone: string;
    address: string;
    location_lat?: number;
    location_lon?: number;
    description: string;
    avatarUrl?: string;
    avatarPreviewUrl?: string;
  };

  const form = useForm<FormValues>({
    defaultValues: createProfileDefaults(null),
    values: initial ? createProfileDefaults(initial) : undefined,
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { isDirty: hasChanges, errors },
  } = form;
  const applyServerFormErrors = useServerFormErrors(setError);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);

  const handleClose = useCallback(() => {
    (onRequestClose ?? onCancel)();
  }, [onCancel, onRequestClose]);

  const onSubmitInternal = async (values: FormValues) => {
    const payload = buildUpdateProfilePayload(values);

    try {
      await onSubmit(payload);
    } catch (err) {
      if (applyServerFormErrors(err)) return;
    }
  };

  const onAvatarSave = useCallback(
    (file: FileEntity) => {
      setValue('avatarUrl', file.url);
      setValue('avatarPreviewUrl', file.previewUrl);
    },

    [setValue],
  );

  const { countryCode, phoneNumber, setCountryCode, setPhoneNumber } = phoneHooks.usePhoneField({
    value: watch('phone'),
    onChange: (newPhone) => setValue('phone', newPhone, { shouldDirty: true }),
  });

  const handlePhoneCodeChange = useCallback(
    (code: string) => setCountryCode(code),
    [setCountryCode],
  );

  const handlePhoneNumberChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(evt.target.value),
    [setPhoneNumber],
  );

  const handleAddressChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
      setValue('address', value, { shouldDirty: true });
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (value.trim().length > 2) {
        searchDebounceRef.current = setTimeout(() => {
          search(value).catch(() => {});
        }, 400);
      } else {
        clear();
      }
    },
    [setValue, search, clear],
  );

  const handleUseMyLocation = useCallback(async () => {
    const result = await getMyLocation();
    if (!result) return;
    const { place, coords } = result;
    if (coords) {
      setValue('location_lat', coords.latitude, { shouldDirty: true });
      setValue('location_lon', coords.longitude, { shouldDirty: true });
    }
    if (place) {
      const condensed = getCondensedAddress(place, () => watch('address'));
      setValue('address', condensed, { shouldDirty: true });
      clear();
    }
  }, [getMyLocation, setValue, clear, watch]);

  const handleSelectResult = useCallback(
    (place: NominatimPlace) => {
      const short = buildShortAddress(place);
      const label = short || place.display_name || `${place.lat},${place.lon}`;
      setValue('address', label, { shouldDirty: true });
      setValue('location_lat', Number(place.lat), { shouldDirty: true });
      setValue('location_lon', Number(place.lon), { shouldDirty: true });
      clear();
    },
    [setValue, clear],
  );

  return (
    <form className='flex min-h-full flex-col gap-6' onSubmit={handleSubmit(onSubmitInternal)}>
      <h2 className='text-2xl mb-6'>Business profile</h2>

      <div className='mt-6 md:mt-0 mb-8 md:mb-0 flex flex-col items-center gap-4 relative md:shrink-0'>
        <AvatarUpload
          imageUri={watch('avatarUrl')}
          isLoading={!!isPending}
          onAvatarSave={onAvatarSave}
          size={AvatarSize.PROFILE}
          framed
          showEditIcon
          placeholderIcon={<AddPhotoIcon width={56} height={56} />}
          confirmSave
        />

        <Button
          fit={ButtonFit.Inline}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={onPreview}
          disabled={previewDisabled}
          className='w-[168px] h-9 min-w-[168px] px-0 py-0 border-0 bg-primary-100 text-[16px] font-medium text-primary-800 shadow-none hover:bg-primary-200 hover:shadow-none focus:bg-primary-200 focus:ring-0 focus:ring-offset-0 focus:shadow-none active:bg-primary-200'
        >
          {t('profilePreview')}
        </Button>
      </div>

      <div className='space-y-6'>
        <div>
          <label htmlFor='name' className='text-sm text-gray-600'>
            {t('businessName')}
          </label>
          <FormInput
            id='name'
            {...register('name', {
              required: t('nameRequired'),
              validate: (value) => (value?.trim()?.length ? true : t('nameRequired')),
            })}
            error={errors.name?.message}
          />
        </div>

        <div>
          <label htmlFor='headline' className='text-sm text-gray-600'>
            {t('headline')}
          </label>
          <FormInput id='headline' {...register('headline')} />
        </div>

        <div>
          <label htmlFor='email' className='text-sm text-gray-600'>
            {t('emailAddress')} *
          </label>
          <FormInput
            id='email'
            type='email'
            readOnly
            {...register('email')}
            accessory={<LockIcon className='text-gray-400' />}
            accessoryPosition={AccessoryPosition.Right}
          />
        </div>

        <div>
          <label htmlFor='address' className='text-sm text-gray-600'>
            {t('address')}
          </label>
          <div className='relative'>
            <FormInput
              id='address'
              {...register('address')}
              value={watch('address') ?? ''}
              onChange={handleAddressChange}
              accessory={
                <button
                  type='button'
                  onClick={handleUseMyLocation}
                  className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <PinDropIcon />
                </button>
              }
              accessoryPosition={AccessoryPosition.Right}
            />
            {searchResults && searchResults.length > 0 && (
              <div className='absolute z-10 left-0 right-0 top-full mt-1'>
                <AddressResults results={searchResults} onSelect={handleSelectResult} />
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor='phone' className='text-sm block mb-1'>
            {t('phoneNumber')}
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
              />
            </div>
          </div>
        </div>

        <FormTextarea
          id='description'
          label={t('about')}
          maxLength={200}
          name='description'
          value={watch('description') ?? ''}
          onChange={(evt) => setValue('description', evt.target.value, { shouldDirty: true })}
        />
      </div>

      <div className='flex justify-between gap-3 mt-auto pt-8'>
        <MuiButton
          type='button'
          onClick={handleClose}
          disabled={isPending}
          color='secondary'
          variant='outlined'
          sx={{ minWidth: 150 }}
        >
          {t('close')}
        </MuiButton>
        <MuiButton
          type='submit'
          disabled={isPending || !hasChanges}
          color='secondary'
          variant='contained'
          sx={{ minWidth: 150 }}
        >
          {isPending ? t('saving') : t('save')}
        </MuiButton>
      </div>
    </form>
  );
}
