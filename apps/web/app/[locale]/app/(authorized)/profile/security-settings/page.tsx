'use client';

import { useTranslations } from 'next-intl';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ChangePasswordForm from '@/_components/ChangePasswordForm/ChangePasswordForm';

export default function SecuritySettingsPage() {
  const t = useTranslations('private.profile.profile');
  return (
    <AppWrapper withPadding>
      <div className='md:px-4 pb-4 mb-6'>
        <h1 className='text-xl md:text-2xl font-medium tracking-wider'>{t('securitySettings')}</h1>
      </div>
      <ChangePasswordForm />
    </AppWrapper>
  );
}
