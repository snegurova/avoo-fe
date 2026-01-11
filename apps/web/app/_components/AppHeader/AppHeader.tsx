'use client';

import React from 'react';
import AppProfileSelect from '@/_components/AppProfileSelect/AppProfileSelect';
import NotificationsIcon from '@/_icons/NotificationsIcon';
import ShareIcon from '@/_icons/ShareIcon';
import IconLink from '@/_components/IconLink/IconLink';
import { appRoutes } from '@/_routes/routes';
import SelectButton from '../SelectButton/SelectButton';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const router = useRouter();

  const options = [
    {
      label: 'New Booking',
      handler: () => {},
    },
    {
      label: 'New Post',
      handler: () => {
        router.push(appRoutes.AddPost);
      },
    },
  ];

  return (
    <header className='flex items-center justify-between gap-30'>
      <div className='bg-primary-100 rounded-2xl px-4 py-3.5 font-medium grow'>
        <p className='text-primary-800'>Billing or marketing notification</p>
      </div>
      <div className='flex items-center gap-25 shrink-0'>
        <div className=''>
          <SelectButton label='Add' options={options} />
        </div>
        <div className='flex items-center gap-6'>
          <ShareIcon className='transition-colors' />
          <IconLink
            href={appRoutes.Notifications}
            icon={<NotificationsIcon className='transition-colors' />}
            label='Notifications'
          />
          <AppProfileSelect />
        </div>
      </div>
    </header>
  );
}
