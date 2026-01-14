'use client';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { AvatarUpload, AvatarSize } from '@/_components/AvatarUpload/AvatarUpload';
import { userHooks } from '@avoo/hooks';
import FormInput from '@/_components/FormInput/FormInput';
import type { components } from '@avoo/axios/types/generated';
import type { NominatimPlace, VisualProfileInfo } from '@avoo/shared';
import { buildShortAddress, useAddressSearch, getCondensedAddress } from '@avoo/shared';
import AddressResults from './AddressResults';
import { createProfileDefaults, buildUpdateProfilePayload } from './helpers';
import useAvatarUpload from './useAvatarUpload';

type Props = {
  initial?: VisualProfileInfo | null;
  onSubmit: (payload: Partial<components['schemas']['UpdateProfileDto']>) => Promise<unknown>;
  onCancel: () => void;
  isPending?: boolean;
  showPreview?: boolean;
};

export default function EditProfileForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
  showPreview = false,
}: Readonly<Props>) {
  const { handleUpdateAvatar, handleUpdateAvatarAsync } = userHooks.usePatchUserProfileAvatar();

  const { search, searchResults, isSearching, clear, getMyLocation } = useAddressSearch();
  const { localPreview, handleImageSelected } = useAvatarUpload({
    initialPreview: initial?.avatarPreviewUrl ?? initial?.avatarUrl ?? null,
    upload: (file: File) => {
      if (handleUpdateAvatarAsync) return handleUpdateAvatarAsync(file);
      return Promise.resolve(handleUpdateAvatar(file));
    },
  });

  type FormValues = {
    name: string;
    phone: string;
    address: string;
    location_lat?: number;
    location_lon?: number;
    description: string;
  };

  const form = useForm<FormValues>({
    defaultValues: createProfileDefaults(initial),
  });

  const { register, handleSubmit, setValue, setError, watch } = form;

  const handleSearchClick = useCallback(async () => {
    const query = watch('address');
    if (!query) return;
    await search(query);
  }, [search, watch]);

  const handleUseMyLocation = useCallback(async () => {
    const result = await getMyLocation();
    if (!result) return;
    const { place, coords } = result;
    if (coords) {
      setValue('location_lat', coords.latitude);
      setValue('location_lon', coords.longitude);
    }
    if (place) {
      const condensed = getCondensedAddress(place, () => watch('address'));
      setValue('address', condensed);
      clear();
    }
  }, [getMyLocation, setValue, clear, watch]);

  const handleSelectResult = useCallback(
    (place: NominatimPlace) => {
      const short = buildShortAddress(place);
      const label = short || place.display_name || `${place.lat},${place.lon}`;
      setValue('address', label);
      setValue('location_lat', Number(place.lat));
      setValue('location_lon', Number(place.lon));
      clear();
    },
    [setValue, clear],
  );

  const onImageSelected = useCallback(
    (file: File) => {
      handleImageSelected(file);
    },
    [handleImageSelected],
  );

  const onSubmitInternal = async (values: FormValues) => {
    const payload = buildUpdateProfilePayload(values);

    try {
      await onSubmit(payload);
    } catch (err) {
      const maybe = err as {
        errors?: Array<{ field?: string; message?: string }>;
        errorMessage?: string;
      };
      if (Array.isArray(maybe?.errors)) {
        maybe.errors.forEach((fieldError) => {
          if (fieldError.field) {
            setError(fieldError.field as keyof FormValues, {
              type: 'server',
              message: fieldError.message ?? 'Validation error',
            });
          }
        });
      }
    }
  };

  return (
    <form
      className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'
      onSubmit={handleSubmit(onSubmitInternal)}
    >
      {showPreview && (
        <div className='flex justify-center'>
          <AvatarUpload
            imageUri={localPreview}
            onImageSelected={onImageSelected}
            isLoading={Boolean(isPending)}
            size={AvatarSize.LARGE}
          />
        </div>
      )}

      <div>
        <label htmlFor='name' className='text-sm text-gray-600'>
          Display Name
        </label>
        <FormInput id='name' {...register('name')} />
      </div>

      <div>
        <label htmlFor='phone' className='text-sm text-gray-600'>
          Phone
        </label>
        <FormInput id='phone' {...register('phone')} />
      </div>

      <div>
        <label htmlFor='address' className='text-sm text-gray-600'>
          Address
        </label>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <FormInput id='address' {...register('address')} />
            <Button type='button' size='small' onClick={handleSearchClick}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button type='button' size='small' onClick={handleUseMyLocation}>
              Use my location
            </Button>
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className='mt-2 bg-white border rounded shadow-sm max-h-48 overflow-auto'>
              <AddressResults results={searchResults} onSelect={handleSelectResult} />
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor='description' className='text-sm text-gray-600'>
          About
        </label>
        <FormInput id='description' {...register('description')} />
      </div>

      <div className='flex justify-center gap-3'>
        <Button
          onClick={onCancel}
          disabled={isPending}
          color='secondary'
          variant='outlined'
          sx={{ minWidth: 150 }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={isPending}
          color='secondary'
          variant='contained'
          sx={{ minWidth: 150 }}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
