'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { userHooks } from '@avoo/hooks';

import PublicOrderCreate from '@/_components/PublicOrderCreate/PublicOrderCreate';
import PublicWrapper from '@/_components/PublicWrapper/PublicWrapper';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function PublicOrderCreatePage() {
  const params = useParams();
  const userId = Number(params.userId);

  const data = userHooks.useGetPublicUser(userId);

  return (
    <PublicWrapper
      headerChildren={
        <Link
          href={`${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}`}
          className='flex items-center shrink-0 gap-8'
        >
          <div className='rounded-full w-15 h-15'>
            {data?.avatarPreviewUrl && (
              <img
                src={data.avatarPreviewUrl}
                alt={data?.businessInfo?.name ?? 'salon avatar'}
                className='rounded-full w-full h-full object-cover'
              />
            )}
          </div>
          <p className='hidden lg:inline text-gray-600 text-2xl font-medium'>
            {data?.businessInfo?.name}
          </p>
        </Link>
      }
      classes='px-5 md:px-9 xl:px-16 2xl:px-47 text-gray-600'
    >
      <PublicOrderCreate />
    </PublicWrapper>
  );
}
