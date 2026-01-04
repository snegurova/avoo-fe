'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { AvatarUpload, AvatarSize } from '@/_components/AvatarUpload/AvatarUpload';
import { userHooks } from '@avoo/hooks';
import FormInput from '@/_components/FormInput/FormInput';
import type { components } from '@avoo/axios/types/generated';
import type { NominatimPlace, VisualProfileInfo } from '@avoo/shared';
import { buildShortAddress } from '@avoo/shared';

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
}: Props) {
  const { handleUpdateAvatar } = userHooks.usePatchUserProfileAvatar();

  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(
    initial?.avatarPreviewUrl ?? initial?.avatarUrl ?? null,
  );
  const [searchResults, setSearchResults] = useState<NominatimPlace[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  type FormValues = {
    name: string;
    phone: string;
    address: string;
    location_lat?: number | undefined;
    location_lon?: number | undefined;
    description: string;
  };

  const form = useForm<FormValues>({
    defaultValues: {
      name: initial?.name ?? '',
      phone: initial?.phone ?? '',
      address: initial?.address ?? '',
      location_lat: initial?.location_lat ?? undefined,
      location_lon: initial?.location_lon ?? undefined,
      description: initial?.description ?? '',
    },
  });

  const { register, handleSubmit, setValue, setError, watch } = form;

  const handleImageSelected = (file: File) => {
    setLocalAvatarPreview(URL.createObjectURL(file));
    void Promise.resolve(handleUpdateAvatar(file)).catch(() => null);
  };

  const onSubmitInternal = async (values: FormValues) => {
    const payload: Partial<components['schemas']['UpdateProfileDto']> = {
      name: values.name || undefined,
      phone: values.phone || undefined,
      description: values.description || undefined,
      address: values.address || undefined,
      location_lat:
        typeof values.location_lat === 'number' && !Number.isNaN(values.location_lat)
          ? values.location_lat
          : undefined,
      location_lon:
        typeof values.location_lon === 'number' && !Number.isNaN(values.location_lon)
          ? values.location_lon
          : undefined,
    };

    await Promise.resolve(onSubmit(payload)).catch((e) => {
      const maybe = e as {
        errors?: Array<{ field?: string; message?: string }>;
        errorMessage?: string;
      };
      if (maybe?.errors && Array.isArray(maybe.errors)) {
        maybe.errors.forEach((it) => {
          if (it.field)
            setError(it.field as keyof FormValues, {
              type: 'server',
              message: it.message ?? 'Validation error',
            });
        });
      }
    });
  };

  return (
    <form
      className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'
      onSubmit={handleSubmit(onSubmitInternal)}
    >
      {showPreview && (
        <div className='flex justify-center'>
          <AvatarUpload
            imageUri={localAvatarPreview}
            onImageSelected={handleImageSelected}
            isLoading={Boolean(isPending)}
            size={AvatarSize.LARGE}
          />
        </div>
      )}

      <div>
        <label className='text-sm text-gray-600'>Display Name</label>
        <FormInput {...register('name')} />
      </div>

      <div>
        <label className='text-sm text-gray-600'>Phone</label>
        <FormInput {...register('phone')} />
      </div>

      <div>
        <label className='text-sm text-gray-600'>Address</label>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <FormInput {...register('address')} />
            <Button
              type='button'
              size='small'
              onClick={async () => {
                const query = watch('address');
                if (!query) return;
                setIsSearching(true);
                setSearchResults(null);
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
                    query,
                  )}`,
                ).catch(() => null);
                if (res) {
                  const data = (await res.json().catch(() => null)) as NominatimPlace[] | null;
                  if (data && data.length > 0) setSearchResults(data);
                }
                setIsSearching(false);
              }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type='button'
              size='small'
              onClick={() => {
                if (!navigator.geolocation) return;
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    setValue('location_lat', lat);
                    setValue('location_lon', lon);
                    const res = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
                    ).catch(() => null);
                    if (res) {
                      const j = (await res.json().catch(() => null)) as NominatimPlace | null;
                      if (j) {
                        const short = buildShortAddress(j);
                        const condensed =
                          short && short.length > 0
                            ? short
                            : j.display_name
                              ? j.display_name.split(',').slice(0, 3).join(',')
                              : watch('address');
                        setValue('address', condensed);
                        setSearchResults(null);
                      }
                    }
                  },
                  () => {},
                );
              }}
            >
              Use my location
            </Button>
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className='mt-2 bg-white border rounded shadow-sm max-h-48 overflow-auto'>
              {searchResults.map((r) => {
                const short = buildShortAddress(r);
                const label = short || r.display_name || `${r.lat},${r.lon}`;
                return (
                  <button
                    key={`${r.lat}-${r.lon}`}
                    type='button'
                    className='w-full text-left px-3 py-2 hover:bg-gray-100'
                    onClick={() => {
                      setValue('address', label);
                      setValue('location_lat', Number(r.lat));
                      setValue('location_lon', Number(r.lon));
                      setSearchResults(null);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className='text-sm text-gray-600'>About</label>
        <FormInput {...register('description')} />
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
