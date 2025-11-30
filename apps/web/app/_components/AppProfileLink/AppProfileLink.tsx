'use client';

import React from 'react';
import Link from 'next/link';
import { appRoutes } from '@/_routes/routes';
import { userHooks } from '@avoo/hooks';

export default function AppProfileLink() {
  const { visualProfileInfo } = userHooks.useGetUserProfile();

  const firstLetter = visualProfileInfo?.name ? visualProfileInfo.name.charAt(0) : '';

  return (
    <Link
      href={appRoutes.Profile}
      className='rounded-full bg-avatar w-10 h-10 flex items-center justify-center text-xl font-medium'
    >
      <span className='uppercase'>{firstLetter}</span>
    </Link>
  );
}
