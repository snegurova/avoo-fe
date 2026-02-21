'use client';
import { Button, Typography } from '@mui/material';
import { categoriesHooks, masterHooks, mediaHooks } from '@avoo/hooks';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceAddForm from '@/_components/ServiceAddForm/ServiceAddForm';

export default function ServicesCreatePage() {
  const categories = categoriesHooks.useGetPublicCategories();
  const masters = masterHooks.useGetMastersProfileInfo();
  const isUploading = mediaHooks.useUploadMedia().isUploading;

  return (
    <AppWrapper withPadding>
      <Typography variant='h1'>Add service</Typography>
      <div className='overflow-y-auto'>
        <ServiceAddForm categories={categories || []} masters={masters?.items || []} />
      </div>

      <section id='create-new-service-controls'>
        <div className='w-full flex gap-8 justify-end p-8'>
          <Button color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button
            form='create-new-service'
            type='submit'
            color='secondary'
            variant='contained'
            disabled={isUploading}
          >
            Save
          </Button>
        </div>
      </section>
    </AppWrapper>
  );
}
