import React from 'react';
import { useTranslations } from 'next-intl';

type Props = { userId: number };

export default function SalonPageCertificatesTab(props: Props) {
  const { userId } = props;
  const t = useTranslations('public.salon.page');

  return (
    <div className='flex justify-center items-center py-4 xl:py-8 flex-1'>
      {userId && <p className='max-w-160 px-5 text-center'>{t('sertificatesPlaceholder')}</p>}
    </div>
  );
}
