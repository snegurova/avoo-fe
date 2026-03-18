'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { userHooks } from '@avoo/hooks';

import LanguageSwitcher from '@/_components/LanguageSwitcher/LanguageSwitcher';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function SalonPublicPage() {
  const t = useTranslations('public.salon.page');
  const params = useParams();
  const userId = params.userId;

  const data = userHooks.useGetPublicUser(userId ? Number(userId) : 0);

  return (
    <>
      <header className=''>
        <div className='container mx-auto'>
          <div className='border-b border-gray-200 py-2 flex items-center justify-end gap-4'>
            <LanguageSwitcher type='public' />
          </div>
        </div>
      </header>
      <div className='container px-11 mx-auto'>
        <div className='pt-11 flex gap-11'>
          <div className='flex flex-col gap-15 items-center'>
            <div className='rounded-full w-28 h-28'>
              {data?.avatarPreviewUrl && (
                <Image
                  src={data.avatarPreviewUrl}
                  alt='Avatar'
                  width={112}
                  height={112}
                  className='rounded-full'
                />
              )}
            </div>
            <Link
              href={`${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}`}
            >
              {t('ctaButton')}
            </Link>
          </div>
          <div className=''></div>
        </div>
      </div>
    </>
  );
}
