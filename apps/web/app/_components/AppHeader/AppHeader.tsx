'use client';

import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/navigation';

import useMediaQuery from '@mui/material/useMediaQuery';

import { messages } from '@avoo/intl/messages/private/navigation/navigation';

import AppProfileSelect from '@/_components/AppProfileSelect/AppProfileSelect';
import { IconButton } from '@/_components/IconButton/IconButton';
import IconLink from '@/_components/IconLink/IconLink';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import SelectButton from '@/_components/SelectButton/SelectButton';
import { localizationHooks } from '@/_hooks/localizationHooks';
import AddIcon from '@/_icons/AddIcon';
import MenuIcon from '@/_icons/MenuIcon';
import NotificationsIcon from '@/_icons/NotificationsIcon';
import ShareIcon from '@/_icons/ShareIcon';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  setMenuOpen: (open: boolean) => void;
};

export default function AppHeader({ setMenuOpen }: Props) {
  const router = useRouter();
  const tabletUp = useMediaQuery('(min-width:768px)');
  const orderCreatePath = localizationHooks.useWithLocale(AppRoutes.OrderCreate);

  const options = [
    {
      label: <FormattedMessage {...messages.newBooking} />,
      handler: () => {
        router.push(orderCreatePath);
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
          <LocalizedLink
            href={AppRoutes.OrderCreate}
            className='w-15 h-15 rounded-full bg-primary-300 flex items-center justify-center fixed bottom-6 right-2 lg:hidden z-40'
          >
            <AddIcon className='w-8 h-8 fill-primary-900' />
          </LocalizedLink>
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
