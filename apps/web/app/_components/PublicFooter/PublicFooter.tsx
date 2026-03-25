import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function PublicFooter() {
  const t = useTranslations('public.salon.page');

  return (
    <footer>
      <div className='container mx-auto'>
        <div className='border-t border-gray-200 py-3 flex flex-col md:flex-row items-center md:justify-between gap-3 px-6'>
          <Link
            href='#'
            className='text-sm leading-[1.1] text-gray-600 hover:text-primary-500 focus:primary-500 transition-colors'
          >
            {t('termsPrivacy')}
          </Link>
          <span className='text-sm leading-[1.1] text-gray-600'>
            © {new Date().getFullYear()} Avoo. {t('allRightsReserved')}
          </span>
        </div>
      </div>
    </footer>
  );
}
