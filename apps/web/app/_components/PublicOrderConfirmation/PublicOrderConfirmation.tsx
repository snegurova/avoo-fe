import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { localizationHooks } from '@/_hooks/localizationHooks';
import CheckIcon from '@/_icons/CheckIcon';
import { AppRoutes } from '@/_routes/routes';

export default function PublicOrderConfirmation({ userId }: { userId: number }) {
  const t = useTranslations('public.salon.confirmation');
  const withLocale = localizationHooks.useWithLocale;

  return (
    <div className='flex-1 flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center p-6 md:p-10 lg:p-20 bg-white rounded-lg shadow-md border border-gray-200 max-w-xl mx-auto mt-10'>
        <div className='h-37.5 w-37.5 rounded-full bg-green-100 flex items-center justify-center mb-8'>
          <CheckIcon className='w-25 h-25 fill-green-700' />
        </div>
        <div className='text-2xl font-bold text-black mb-3 text-center'>{t('successTitle')}</div>
        <div className='text-gray-600 text-center mb-18'>
          {t('successMessage', {
            defaultValue: 'Your booking was successful. We look forward to seeing you!',
          })}
        </div>
        <div className='flex gap-4 w-full justify-center flex-wrap'>
          <Link
            href={`${withLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}`}
            className='font-semibold bg-black rounded-lg p-3.5 text-white border-black transition-colors hover:bg-white focus:bg-white hover:text-black focus:text-black border min-w-40 text-center'
          >
            {t('bookMore')}
          </Link>
          <Link
            href={`${withLocale(AppRoutes.PublicSalon)}/${userId}`}
            className='font-semibold bg-gray-100 rounded-lg p-3.5 text-black border-black transition-colors hover:bg-black focus:bg-black hover:text-white focus:text-white border min-w-40 text-center'
          >
            {t('returnToSalon')}
          </Link>
        </div>
      </div>
    </div>
  );
}
