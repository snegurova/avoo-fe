'use client';
import React from 'react';
import { appRoutes } from '@/_routes/routes';
import { routerHooks } from '@/_hooks/routerHooks';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { IconButton } from '@/_components/IconButton/IconButton';

import { userHooks } from '@avoo/hooks';
import EditProfileForm from '@/_components/ProfileEdit/EditProfileForm';
import type { UpdateProfile } from '@avoo/axios/types/apiTypes';

export default function EditProfilePage() {
  const handleBackClick = routerHooks.useBackWithFallback(appRoutes.Profile);

  const { handleUpdateProfile, handleUpdateProfileAsync, isPending } = userHooks.useUpdateProfile();
  const { visualProfileInfo } = userHooks.useGetUserProfile();

  const handleSubmit = async (payload: UpdateProfile) => {
    if (handleUpdateProfileAsync) {
      await handleUpdateProfileAsync(payload);
    } else {
      handleUpdateProfile(payload);
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
          location_lat: visualProfileInfo?.location_lat ?? null,
          location_lon: visualProfileInfo?.location_lon ?? null,
          avatarPreviewUrl:
            visualProfileInfo?.avatarPreviewUrl ?? visualProfileInfo?.avatarUrl ?? undefined,
        }}
        onSubmit={handleSubmit}
        onCancel={handleBackClick}
        isPending={isPending}
        showPreview
      />
    </div>
  );
}
