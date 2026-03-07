'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import useMediaQuery from '@mui/material/useMediaQuery';

import AppProfileSelect from '@/_components/AppProfileSelect/AppProfileSelect';
import IconLink from '@/_components/IconLink/IconLink';
import { localizationHooks } from '@/_hooks/localizationHooks';
import MenuIcon from '@/_icons/MenuIcon';
import NotificationsIcon from '@/_icons/NotificationsIcon';
import ShareIcon from '@/_icons/ShareIcon';
import { AppRoutes } from '@/_routes/routes';

import { IconButton } from '../IconButton/IconButton';
import SelectButton from '../SelectButton/SelectButton';
import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/private/navigation/navigation';

type Props = {
  setMenuOpen: (open: boolean) => void;
};

export default function AppHeader({ setMenuOpen }: Props) {
  const router = useRouter();
  const tabletUp = useMediaQuery('(min-width:768px)');

  const options = [
    {
      label: <FormattedMessage {...messages.newBooking} />,
      handler: () => {
        router.push(localizationHooks.useWithLocale(AppRoutes.OrderCreate));
      },
    },
    {
      label: <FormattedMessage {...messages.newPost} />,
      handler: () => {
        router.push(localizationHooks.useWithLocale(AppRoutes.AddPost));
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
            <SelectButton label={<FormattedMessage {...messages.add} />} options={options} />
          </div>
          <div className='flex items-center gap-2'>
            <ShareIcon className='transition-colors' />
            <IconLink
              href={localizationHooks.useWithLocale(AppRoutes.Notifications)}
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
