'use client';
import React from 'react';

import type { UpdateProfile } from '@avoo/axios/types/apiTypes';
import { userHooks } from '@avoo/hooks';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import EditProfileForm from '@/_components/ProfileEdit/EditProfileForm';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { routerHooks } from '@/_hooks/routerHooks';
import { AppRoutes } from '@/_routes/routes';

export default function EditProfilePage() {
  const handleBackClick = routerHooks.useBackWithFallback(
    localizationHooks.useWithLocale(AppRoutes.Profile),
  );

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
    <AppWrapper>
      <SectionHeader title='Edit Profile' />

      <EditProfileForm
        initial={{
          name: visualProfileInfo?.name ?? null,
          phone: visualProfileInfo?.phone ?? null,
          description: visualProfileInfo?.description ?? null,
          address: visualProfileInfo?.address ?? null,
          location_lat: visualProfileInfo?.location_lat ?? null,
          location_lon: visualProfileInfo?.location_lon ?? null,
          avatarPreviewUrl: visualProfileInfo?.avatarPreviewUrl ?? undefined,
          avatarUrl: visualProfileInfo?.avatarUrl ?? undefined,
        }}
        onSubmit={handleSubmit}
        onCancel={handleBackClick}
        isPending={isPending}
        showPreview
      />
    </AppWrapper>
  );
}
