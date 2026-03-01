'use client';
import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/public/salon/page';
import { AppRoutes } from '@/_routes/routes';
import { localizationHooks } from '@/_hooks/localizationHooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
