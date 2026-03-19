import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { GetPublicUserProfileResponse } from '@avoo/axios/types/apiTypes';

import DescriptionWithToggle from '@/_components/DescriptionWithToggle/DescriptionWithToggle';
import { localizationHooks } from '@/_hooks/localizationHooks';
import CallIcon from '@/_icons/CallIcon';
import DistanceIcon from '@/_icons/DistanceIcon';
import LanguageIcon from '@/_icons/LanguageIcon';
import MailIcon from '@/_icons/MailIcon';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  data: GetPublicUserProfileResponse | null;
  userId: number;
};

export default function SalonPageTop(props: Props) {
  const { data, userId } = props;
  const t = useTranslations('public.salon.page');

  return (
    <div className='px-5 md:px-0 pt-11 grid lg:grid-cols-4'>
      <div className='flex flex-col gap-15 items-center'>
        <div className='rounded-full w-28 h-28'>
          {data?.avatarPreviewUrl && (
            <img
              src={data.avatarPreviewUrl}
              alt='avatar'
              className='rounded-full w-full h-full object-cover'
            />
          )}
        </div>
        <Link
          href={`${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}`}
          className='font-semibold bg-black rounded-lg p-3.5 justify-center text-white w-full border-black transition-colors hover:bg-white focus:bg-white hover:text-black focus:text-black border hidden lg:flex'
        >
          {t('ctaButton')}
        </Link>
      </div>
      <div className='pl-11 flex flex-col gap-6 lg:col-span-3'>
        <div className=''>
          <h1 className='text-2xl font-medium'>{data?.businessInfo?.name}</h1>
          {data?.businessInfo?.headline && (
            <p className='text-sm leading-none'>{data.businessInfo.headline}</p>
          )}
        </div>
        <ul className='flex flex-wrap gap-y-2 gap-x-2 xl:gap-x-6 text-xs'>
          {data?.businessInfo?.address && (
            <li className='flex gap-2 items-center'>
              <DistanceIcon className='h-4 w-4 fill-current' />
              <address className='not-italic'>{data.businessInfo.address}</address>
            </li>
          )}
          {data?.businessInfo?.phone && (
            <li className=''>
              <a
                href={`tel:${data.businessInfo.phone}`}
                className='flex gap-2 items-center hover:text-primary-500 focus:text-primary-500 transition-colors'
              >
                <CallIcon className='h-4 w-4 fill-current transition-colors' />
                <span>{data.businessInfo.phone}</span>
              </a>
            </li>
          )}
          {data?.email && (
            <li className=''>
              <a
                href={`mailto:${data.email}`}
                className='flex gap-2 items-center hover:text-primary-500 focus:text-primary-500 transition-colors'
              >
                <MailIcon className='h-4 w-4 fill-current transition-colors' />
                <span>{data.email}</span>
              </a>
            </li>
          )}
          {data?.businessInfo?.languages && (
            <li className='flex gap-2 items-center'>
              <LanguageIcon className='h-4 w-4 fill-current transition-colors' />
              <span>
                {t('weSpeak')}{' '}
                {data.businessInfo.languages.map((lang) => lang.toUpperCase()).join(', ')}
              </span>
            </li>
          )}
        </ul>
        {data?.businessInfo?.description && (
          <DescriptionWithToggle description={data.businessInfo.description} />
        )}
      </div>
    </div>
  );
}
