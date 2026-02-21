'use client';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import { categoriesHooks, masterHooks, mediaHooks, servicesHooks } from '@avoo/hooks';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceGalleryUpload from '@/_components/ServiceGalleryUpload/ServiceGalleryUpload';
import { useToast } from '@/_hooks/useToast';
import { appRoutes } from '@/_routes/routes';
import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { useState } from 'react';
import { UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import ServiceAddForm from '@/_components/ServiceAddForm/ServiceAddForm';

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
        type: MEDIA_TYPE_ENUM.SERVICE,
      });
    }
  };

  const onRemoveMedia = (id: number) => {
    toast.info('Removed ' + id);
    setMedias(medias.filter((media) => media.id !== id));
  };

  return (
    <AppWrapper withPadding>
      <Typography variant='h1'>Add service</Typography>
      <div className='overflow-y-auto'>
        <ServiceAddForm
          id='create-new-service'
          control={control}
          errors={errors}
          categories={categories || []}
          masters={masters?.items || []}
          onSubmit={handleSubmit}
        >
          <ServiceGalleryUpload
            id='gallery-upload'
            medias={medias}
            onFilePicked={onFilePicked}
            onRemove={onRemoveMedia}
            isUploading={isUploading}
          />
        </ServiceAddForm>
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
