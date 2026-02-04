'use client';
import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/public/home/topSection';
import { appRoutes } from '@/_routes/routes';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';

export default function HomePage() {
  return (
    <div className='container flex flex-col items-center gap-10'>
      <FormattedMessage {...messages.title} />
      <LocalizedLink
        href={appRoutes.Home}
        className='bg-primary-500 text-white py-2.5 px-4 rounded-2xl'
      >
        <FormattedMessage {...messages.ctaButton} />
      </LocalizedLink>
    </div>
  );
}
