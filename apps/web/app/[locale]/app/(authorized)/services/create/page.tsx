'use client';
import { Typography } from '@mui/material';

import { categoriesHooks } from '@avoo/hooks';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceAddForm from '@/_components/ServiceAddForm/ServiceAddForm';

export default function ServicesCreatePage() {
  const categories = categoriesHooks.useGetPublicCategories();

  return (
    <AppWrapper withPadding>
      <Typography variant='h1'>Add service</Typography>
      <ServiceAddForm categories={categories || []} />
    </AppWrapper>
  );
}
