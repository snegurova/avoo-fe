'use client';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { messages } from '@avoo/intl/messages/public/salon/page';

import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function SalonPublicPage() {
  const params = useParams();
  const userId = params.userId;
  return (
    <div className='container flex flex-col items-center gap-10'>
      <Link
        href={`${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}`}
      >
        <FormattedMessage {...messages.ctaButton} />
      </Link>
    </div>
  );
}
