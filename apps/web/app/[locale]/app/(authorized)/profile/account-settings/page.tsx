'use client';

import { useTranslations } from 'next-intl';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';

export default function AccountSettingsPage() {
  const t = useTranslations('private.profile.profile');
  return (
    <AppWrapper withPadding>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1' variant='h1'>
          {t('accountSettings')}
        </Typography>
      </div>
    </AppWrapper>
  );
}
