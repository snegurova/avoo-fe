'use client';

import { useTranslations } from 'next-intl';

import { userHooks } from '@avoo/hooks';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { ProfileCertificates } from '@/_components/ProfileCertificates/ProfileCertificates';
import { ProfileGallery } from '@/_components/ProfileGallery/ProfileGallery';
import { ProfileInfo } from '@/_components/ProfileInfo/ProfileInfo';
import { ProfileLanguages } from '@/_components/ProfileLanguages/ProfileLanguages';

export default function ProfilePage() {
  const t = useTranslations('private.profile');
  const { visualLanguages } = userHooks.useGetUserProfile();

  return (
    <AppWrapper>
      <div className='py-7 lg:py-14 flex flex-col overflow-auto hide-scrollbar'>
        <h1 className='sr-only'>{t('profile')}</h1>
        <div className='px-5 md:px-8 lg:px-11 overflow-auto flex flex-col gap-8'>
          <section className='md:rounded-2xl md:border md:border-gray-100 md:p-6 lg:p-8'>
            <ProfileInfo />
          </section>

          <div className='flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[7fr_3fr] lg:items-start'>
            <div className='order-2 lg:order-1 flex flex-col gap-8'>
              <section className='md:rounded-2xl md:border md:border-gray-100 md:p-6'>
                <ProfileGallery />
              </section>
              <section className='md:rounded-2xl md:border md:border-gray-100 md:p-6'>
                <ProfileCertificates />
              </section>
            </div>

            <section className='order-1 lg:order-2 md:rounded-2xl md:border md:border-gray-100 md:p-6'>
              <ProfileLanguages languages={visualLanguages} />
            </section>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
}
