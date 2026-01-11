'use client';
import React from 'react';
import { appRoutes } from '@/_routes/routes';
import { routerHooks } from '@/_hooks/routerHooks';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { IconButton } from '@/_components/IconButton/IconButton';

export default function EditProfilePage() {
  const handleBackClick = routerHooks.useBackWithFallback(appRoutes.Profile);

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />
      <SectionHeader title='Edit Profile' />

    </div>
  );
}
