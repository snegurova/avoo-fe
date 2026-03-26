import React, { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { userHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

type Props = { userId: number };

export default function SalonPageCertificatesTab(props: Props) {
  const { userId } = props;
  const t = useTranslations('public.salon.page');
  const isPending = useApiStatusStore((state) => state.isPending);

  const { data, fetchNextPage, hasNextPage } = userHooks.useGetPublicCertificatesInfinite({
    userId,
    limit: 6,
  });

  const certificates = useMemo(
    () => data?.pages.flatMap((page) => page?.data?.items) || [],
    [data],
  );

  useEffect(() => {
    const handleWindowScroll = () => {
      if (!hasNextPage || !fetchNextPage || isPending) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = 200;
      const pageHeight = document.body.offsetHeight;
      if (pageHeight - scrollPosition < threshold) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [hasNextPage, fetchNextPage, isPending]);

  return (
    <div className='flex justify-center py-4 xl:py-8 flex-1'>
      {certificates?.length === 0 && (
        <p className='max-w-160 px-5 text-center'>{t('sertificatesPlaceholder')}</p>
      )}
      {certificates?.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-5 md:px-11 lg:px-0 w-full'>
          {certificates.map((certificate) =>
            certificate ? (
              <div key={certificate.id} className='px-2 pt-2 pb-4 flex flex-col gap-6'>
                {certificate.previewUrl && typeof certificate.previewUrl === 'string' && (
                  <img
                    src={certificate.previewUrl}
                    alt={certificate.title}
                    className='w-full h-auto object-cover'
                  />
                )}
                <div className='flex flex-col gap-1 px-3'>
                  <h3 className='text-sm font-medium text-black leading-none'>
                    {certificate.title}
                  </h3>
                  <span className='text-xs text-gray-600 leading-none'>
                    {timeUtils.formatDateToIssuedDate(certificate.issueDate)}
                  </span>
                </div>
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
