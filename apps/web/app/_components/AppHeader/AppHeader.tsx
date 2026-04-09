'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { userHooks } from '@avoo/hooks';

import AppProfileSelect from '@/_components/AppProfileSelect/AppProfileSelect';
import { IconButton } from '@/_components/IconButton/IconButton';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import SelectButton from '@/_components/SelectButton/SelectButton';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import AddIcon from '@/_icons/AddIcon';
import MenuIcon from '@/_icons/MenuIcon';
import ShareIcon from '@/_icons/ShareIcon';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  setMenuOpen: (open: boolean) => void;
};

export default function AppHeader({ setMenuOpen }: Props) {
  const t = useTranslations('private.navigation.navigation');
  const tCard = useTranslations('private.components.ServiceCard.ServiceCard');
  const router = useRouter();

  const toast = useToast();
  const orderCreatePath = localizationHooks.useWithLocale(AppRoutes.OrderCreate);

  const { userId } = userHooks.useGetUserProfile();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareLink = `${baseUrl}${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}`;

  const options = [
    {
      label: t('newBooking'),
      handler: () => {
        router.push(orderCreatePath);
      },
    },
  ];

  const onMenuClick = useMemo(
    () => () => {
      setMenuOpen(true);
    },
    [],
  );

  const onShareClick = () => {
    navigator.clipboard.writeText(shareLink);
    toast.info(tCard('copiedToClipboard'));
  };

  return (
    <header className='px-4 md:px-0 flex flex-col gap-3 md:gap-0'>
      <div className='flex items-center justify-between lg:justify-end gap-23'>
        <div className='block lg:hidden'>
          <IconButton icon={<MenuIcon />} onClick={onMenuClick} />
        </div>
        <div className='flex items-center lg:gap-6 xl:gap-10 2xl:gap-25 shrink-0'>
          <div className='hidden lg:block'>
            <SelectButton label={t('add')} options={options} />
          </div>
          <LocalizedLink
            href={AppRoutes.OrderCreate}
            className='w-15 h-15 rounded-full bg-primary-300 flex items-center justify-center fixed bottom-6 right-2 lg:hidden z-40'
          >
            <AddIcon className='w-8 h-8 fill-primary-900' />
          </LocalizedLink>
          <div className='flex items-center gap-2'>
            <IconButton icon={<ShareIcon className='transition-colors' />} onClick={onShareClick} />
            <AppProfileSelect />
          </div>
        </div>
      </div>
    </header>
  );
}
