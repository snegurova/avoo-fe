'use client';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import { categoriesHooks, masterHooks, mediaHooks, servicesHooks } from '@avoo/hooks';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import CreateServiceForm from '@/_components/CreateServiceForm/CreateServiceForm';
import ServiceGalleryUpload from '@/_components/ServiceGalleryUpload/ServiceGalleryUpload';
import { useToast } from '@/_hooks/useToast';
import { appRoutes } from '@/_routes/routes';
import { MediaType } from '@avoo/hooks/types/mediaType';
import { useState } from 'react';
import { UploadMediaResponse } from '@avoo/axios/types/apiTypes';

export default function ServicesCreatePage() {
  const router = useRouter();
  const toast = useToast();
  const categories = categoriesHooks.useGetPublicCategories();
  const masters = masterHooks.useGetMastersProfileInfo();
  const [medias, setMedias] = useState<UploadMediaResponse[]>([]);

  const { control, setValue, getValues, handleSubmit, errors } = servicesHooks.useCreateServiceForm(
    {
      onSuccess: () => {
        toast.success('Service has been created!');
        router.replace(appRoutes.Services);
      },
      onError: (error) => {
        toast.error('Failed to create service: ' + error.message);
      },
    },
  );

  const { uploadMedia, isUploading } = mediaHooks.useUploadMedia({
    onSuccess: (data) => {
      toast.success('Media has been uploaded!');
      setValue('mediaIds', [...getValues('mediaIds'), data.id]);
      setMedias([...medias, data]);
    },
    onError: (error) => {
      toast.error('Failed to upload media: ' + error.message);
    },
  });

  const onFilePicked = (file: File | null) => {
    if (file) {
      uploadMedia({
        file,
        type: MediaType.SERVICE,
      });
    }
  };

  return (
    <AppWrapper>
      <div className='p-11 overflow-y-auto'>
        <Typography variant='h1'>Add service</Typography>
        <CreateServiceForm
          id='create-new-service'
          control={control}
          errors={errors}
          categories={categories || []}
          masters={masters?.items || []}
          setValue={setValue}
          onSubmit={handleSubmit}
        >
          <ServiceGalleryUpload id='gallery-upload' medias={medias} onFilePicked={onFilePicked} />
        </CreateServiceForm>
      </div>

      <section id='create-new-service-controls'>
        <div className='w-full flex gap-8 justify-end p-8'>
          <Button
            color='secondary'
            variant='outlined'
            sx={{
              height: '44px',
            }}
          >
            Cancel
          </Button>
          <Button
            form='create-new-service'
            type='submit'
            color='secondary'
            variant='contained'
            sx={{
              height: '44px',
            }}
          >
            Save
          </Button>
        </div>
      </section>
    </AppWrapper>
  );
}
