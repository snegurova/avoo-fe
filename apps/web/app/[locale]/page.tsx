'use client';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/public/home/topSection';
import { AppRoutes } from '@/_routes/routes';
import { localizationHooks } from '@/_hooks/localizationHooks';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='container flex flex-col items-center gap-10'>
      <FormattedMessage {...messages.title} />
      <Link
        href={localizationHooks.useWithLocale(AppRoutes.Home)}
        className='bg-primary-500 text-white py-2.5 px-4 rounded-2xl'
      >
        <FormattedMessage {...messages.ctaButton} />
      </Link>
    </div>
  );
}
