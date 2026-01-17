'use client';

import React, { useMemo } from 'react';
import AppProfileSelect from '@/_components/AppProfileSelect/AppProfileSelect';
import NotificationsIcon from '@/_icons/NotificationsIcon';
import ShareIcon from '@/_icons/ShareIcon';
import IconLink from '@/_components/IconLink/IconLink';
import { appRoutes } from '@/_routes/routes';
import SelectButton from '../SelectButton/SelectButton';
import { useRouter } from 'next/navigation';
import { IconButton } from '../IconButton/IconButton';
import MenuIcon from '@/_icons/MenuIcon';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  setMenuOpen: (open: boolean) => void;
};

export default function AppHeader({ setMenuOpen }: Props) {
  const router = useRouter();
  const tabletUp = useMediaQuery('(min-width:768px)');

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

  const onMenuClick = useMemo(
    () => () => {
      setMenuOpen(true);
    },
    [],
  );

  return (
    <header className='px-4 md:px-0 flex flex-col gap-3 md:gap-0'>
      <div className='flex items-center justify-between gap-23'>
        <div className='block lg:hidden'>
          <IconButton icon={<MenuIcon />} onClick={onMenuClick} />
        </div>
        {tabletUp && (
          <div className='bg-primary-100 rounded-2xl px-4 py-3.5 font-medium grow'>
            <p className='text-primary-800'>Billing or marketing notification</p>
          </div>
        )}
        <div className='flex items-center lg:gap-6 xl:gap-10 2xl:gap-25 shrink-0'>
          <div className='hidden lg:block'>
            <SelectButton label='Add' options={options} />
          </div>
          <div className='flex items-center gap-2'>
            <ShareIcon className='transition-colors' />
            <IconLink
              href={appRoutes.Notifications}
              icon={<NotificationsIcon className='transition-colors' />}
              label='Notifications'
            />
            <AppProfileSelect />
          </div>
        </div>
      </div>
      {!tabletUp && (
        <div className='bg-primary-100 rounded-2xl px-4 py-3.5 font-medium grow'>
          <p className='text-primary-800'>Billing or marketing notification</p>
        </div>
      )}
    </header>
  );
}
