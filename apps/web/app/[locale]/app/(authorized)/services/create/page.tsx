'use client';
import { useTranslations } from 'next-intl';

import { Typography } from '@mui/material';

import { categoriesHooks } from '@avoo/hooks';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceAddForm from '@/_components/ServiceAddForm/ServiceAddForm';

export default function ServicesCreatePage() {
  const t = useTranslations('private.services.create');
  const categories = categoriesHooks.useGetPublicCategories();

  return (
    <AppWrapper withPadding>
      <Typography variant='formTitle' sx={{ pb: 2 }}>
        {t('addService')}
      </Typography>
      <ServiceAddForm categories={categories || []} className='mt-8' />
    </AppWrapper>
  );
}
