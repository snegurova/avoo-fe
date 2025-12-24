'use client';
import React from 'react';
import { appRoutes } from '@/_routes/routes';
import { routerHooks } from '@/_hooks/routerHooks';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { IconButton } from '@/_components/IconButton/IconButton';
import { userHooks } from '@avoo/hooks';
import EditProfileForm from '@/_components/ProfileEdit/EditProfileForm';
import type { VisualProfileInfo } from '@avoo/shared';

export default function EditProfilePage() {
  const handleBackClick = routerHooks.useBackWithFallback(appRoutes.Profile);

  const { handleUpdateProfile, handleUpdateProfileAsync, isPending } = userHooks.useUpdateProfile();
  const { visualProfileInfo, visualLanguages } = userHooks.useGetUserProfile();

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />
      <SectionHeader title='Edit Profile' />

      <EditProfileForm
        initial={{
          name: visualProfileInfo?.name ?? null,
          phone: visualProfileInfo?.phone ?? null,
          description: visualProfileInfo?.description ?? null,
          address: visualProfileInfo?.address ?? null,
          location_lat: (visualProfileInfo as VisualProfileInfo)?.location_lat ?? null,
          location_lon: (visualProfileInfo as VisualProfileInfo)?.location_lon ?? null,
          avatarPreviewUrl:
            visualProfileInfo?.avatarPreviewUrl ?? visualProfileInfo?.avatarUrl ?? null,
        }}
        onSubmit={(payload) => {
          // ensure languages present — server currently requires non-empty languages array
          if (!visualLanguages || !Array.isArray(visualLanguages) || visualLanguages.length === 0) {
            return Promise.reject({
              errorMessage: 'Please add at least one language in your profile before saving.',
            });
          }

          const payloadWithLangs = { ...payload, languages: visualLanguages } as Partial<
            import('@avoo/axios/types/generated').components['schemas']['UpdateProfileDto']
          >;

          return handleUpdateProfileAsync
            ? handleUpdateProfileAsync(payloadWithLangs)
            : Promise.resolve(handleUpdateProfile(payloadWithLangs));
        }}
        onCancel={handleBackClick}
        isPending={isPending}
        showPreview
      />
    </div>
  );
}
