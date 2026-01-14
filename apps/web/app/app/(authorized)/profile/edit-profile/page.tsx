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

  const handleSubmit = async (
    payload: Partial<
      import('@avoo/axios/types/generated').components['schemas']['UpdateProfileDto']
    >,
  ) => {
    const sanitizedLanguages = (
      Array.isArray(visualLanguages)
        ? visualLanguages.filter((lang) => typeof lang === 'string')
        : []
    ).map((lang) => lang.trim());

    const payloadWithLangs = { ...payload, languages: sanitizedLanguages } as Partial<
      import('@avoo/axios/types/generated').components['schemas']['UpdateProfileDto']
    >;

    if (handleUpdateProfileAsync) {
      await handleUpdateProfileAsync(payloadWithLangs);
    } else {
      handleUpdateProfile(payloadWithLangs);
    }

    handleBackClick();
  };

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
        onSubmit={handleSubmit}
        onCancel={handleBackClick}
        isPending={isPending}
        showPreview
      />
    </div>
  );
}
