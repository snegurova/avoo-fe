'use client';
import { Typography } from '@mui/material';
import { categoriesHooks, masterHooks } from '@avoo/hooks';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceAddForm from '@/_components/ServiceAddForm/ServiceAddForm';

export default function ServicesCreatePage() {
  const categories = categoriesHooks.useGetPublicCategories();
  const masters = masterHooks.useGetMastersProfileInfo();

  return (
    <AppWrapper withPadding>
      <Typography variant='h1'>Add service</Typography>
      <ServiceAddForm categories={categories || []} masters={masters?.items || []} />
    </AppWrapper>
  );
}
