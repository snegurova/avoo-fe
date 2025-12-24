'use client';
import React from 'react';
import { useFormik } from 'formik';
import { Button } from '@mui/material';
import { AvatarUpload, AvatarSize } from '@/_components/AvatarUpload/AvatarUpload';
import { userHooks } from '@avoo/hooks';
import { useState } from 'react';
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
  // use shared util
  const { handleUpdateAvatar } = userHooks.usePatchUserProfileAvatar();

  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(
    initial?.avatarPreviewUrl ?? initial?.avatarUrl ?? null,
  );
  const [searchResults, setSearchResults] = useState<NominatimPlace[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleImageSelected = (file: File) => {
    try {
      setLocalAvatarPreview(URL.createObjectURL(file));
      handleUpdateAvatar(file);
    } catch {
      formik.setStatus?.({ error: 'Avatar upload failed. Please try again.' });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: initial?.name ?? '',
      phone: initial?.phone ?? '',
      address: initial?.address ?? '',
      location_lat: initial?.location_lat ?? undefined,
      location_lon: initial?.location_lon ?? undefined,
      description: initial?.description ?? '',
    },
    onSubmit: async (values, formikHelpers) => {
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

      try {
        await onSubmit(payload);
      } catch (e) {
        const maybe = e as {
          errors?: Array<{ field?: string; message?: string }>;
          errorMessage?: string;
        };
        if (maybe?.errors && Array.isArray(maybe.errors)) {
          const mapped: Record<string, string> = {};
          maybe.errors.forEach((it) => {
            if (it.field) mapped[it.field] = it.message ?? 'Validation error';
          });
          formikHelpers.setErrors(mapped);
        } else if (maybe?.errorMessage) {
          formikHelpers.setStatus({ error: maybe.errorMessage });
        }
      } finally {
        formikHelpers.setSubmitting(false);
      }
    },
  });

  return (
    <form
      className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'
      onSubmit={formik.handleSubmit}
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
        <FormInput name='name' value={formik.values.name} onChange={formik.handleChange} />
      </div>

      <div>
        <label className='text-sm text-gray-600'>Phone</label>
        <FormInput name='phone' value={formik.values.phone} onChange={formik.handleChange} />
      </div>

      <div>
        <label className='text-sm text-gray-600'>Address</label>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <FormInput
              name='address'
              value={formik.values.address}
              onChange={formik.handleChange}
            />
            <Button
              type='button'
              size='small'
              onClick={async () => {
                const query = formik.values.address;
                if (!query) return;
                setIsSearching(true);
                setSearchResults(null);
                try {
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
                      query,
                    )}`,
                  );
                  const data = (await res.json()) as NominatimPlace[];
                  if (data && data.length > 0) {
                    setSearchResults(data);
                  } else {
                    formik.setStatus({ error: 'No results found.' });
                    setTimeout(() => formik.setStatus(undefined), 5000);
                  }
                } catch {
                  formik.setStatus({ error: 'Address lookup failed. Try a different query.' });
                  setTimeout(() => formik.setStatus(undefined), 5000);
                } finally {
                  setIsSearching(false);
                }
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
                    formik.setFieldValue('location_lat', lat);
                    formik.setFieldValue('location_lon', lon);
                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
                      );
                      const j = (await res.json()) as NominatimPlace;
                      if (j) {
                        const short = buildShortAddress(j);
                        const condensed =
                          short && short.length > 0
                            ? short
                            : j.display_name
                              ? j.display_name.split(',').slice(0, 3).join(',')
                              : formik.values.address;
                        formik.setFieldValue('address', condensed);
                        setSearchResults(null);
                      }
                    } catch {
                      formik.setStatus({ error: 'Unable to get address from location.' });
                      setTimeout(() => formik.setStatus(undefined), 5000);
                    }
                  },
                  () => {
                    formik.setStatus({
                      error: 'Unable to determine location. Check browser permissions.',
                    });
                    setTimeout(() => formik.setStatus(undefined), 5000);
                  },
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
                      formik.setFieldValue('address', label);
                      formik.setFieldValue('location_lat', Number(r.lat));
                      formik.setFieldValue('location_lon', Number(r.lon));
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
        <FormInput
          name='description'
          value={formik.values.description}
          onChange={formik.handleChange}
        />
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
