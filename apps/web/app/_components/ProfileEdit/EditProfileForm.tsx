'use client';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@mui/material';

import type { FileEntity, UpdateProfile } from '@avoo/axios/types/apiTypes';
import { useAddressSearch, useServerFormErrors } from '@avoo/hooks';
import { buildUpdateProfilePayload, createProfileDefaults } from '@avoo/hooks';
import type { NominatimPlace, VisualProfileInfo } from '@avoo/shared';
import { buildShortAddress, getCondensedAddress } from '@avoo/shared';

import { AvatarSize, AvatarUpload } from '@/_components/AvatarUpload/AvatarUpload';
import FormInput from '@/_components/FormInput/FormInput';

import AddressResults from './AddressResults';

type Props = {
  initial?: VisualProfileInfo | null;
  onSubmit: (payload: UpdateProfile) => Promise<unknown>;
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
  const { search, searchResults, isSearching, clear, getMyLocation } = useAddressSearch();

  type FormValues = {
    name: string;
    phone: string;
    address: string;
    location_lat?: number;
    location_lon?: number;
    description: string;
    avatarUrl?: string;
    avatarPreviewUrl?: string;
  };

  const form = useForm<FormValues>({
    defaultValues: createProfileDefaults(initial),
  });

  const { register, handleSubmit, setValue, setError, watch } = form;
  const applyServerFormErrors = useServerFormErrors(setError);

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

  return (
    <form
      className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'
      onSubmit={handleSubmit(onSubmitInternal)}
    >
      {showPreview && (
        <div className='flex justify-center'>
          <AvatarUpload
            imageUri={watch('avatarPreviewUrl') || null}
            onAvatarSave={onAvatarSave}
            isLoading={false}
            size={AvatarSize.XLARGE}
            showEditIcon
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
