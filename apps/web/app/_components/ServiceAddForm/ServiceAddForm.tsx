import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Category, UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { mediaHooks, servicesHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import CategorySelect from '@/_components/CategorySelect/CategorySelect';
import MasterAutoCompleteSelect from '@/_components/MasterAutoCompleteSelect/MasterAutoCompleteSelect';
import ServiceGalleryUpload from '@/_components/ServiceGalleryUpload/ServiceGalleryUpload';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';
import { localizationHooks } from '@/_hooks/localizationHooks';

type Props = {
  categories: Category[];
  masters: MasterWithRelationsEntityResponse[];
};

export default function ServiceAddForm(props: Props) {
  const { categories, masters } = props;

  const router = useRouter();
  const toast = useToast();

  const durationOptions = timeUtils.getDurationOptionsRange(15, 300, 15);

  const [medias, setMedias] = useState<UploadMediaResponse[]>([]);

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

  const { control, setValue, getValues, handleSubmit, errors } = servicesHooks.useCreateServiceForm(
    {
      onSuccess: () => {
        toast.success('Service has been created!');
        router.replace(localizationHooks.useWithLocale(AppRoutes.Services));
      },
      onError: (error) => {
        toast.error('Failed to create service: ' + error.message);
      },
    },
  );

  return (
    <>
      <div className='overflow-y-auto'>
        <form id='create-new-service' onSubmit={handleSubmit} className='mt-8 lg:mt-0'>
          <>
            <Typography variant='h3'>Basic detail</Typography>
            <div className='mt-4'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <FormControl fullWidth error={!!errors.name?.message}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        value={field.value ?? ''}
                        label='Title'
                      />
                    )}
                  />
                  {errors.name?.message && <FormHelperText>{errors.name?.message}</FormHelperText>}
                </FormControl>
                <CategorySelect
                  categories={categories}
                  control={control}
                  error={errors.categoryId?.message}
                />

                <FormControl fullWidth error={!!errors.price?.message}>
                  <Controller
                    name='price'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label='Price'
                        type='number'
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                  {errors.price?.message && (
                    <FormHelperText>{errors.price?.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth error={!!errors.durationMinutes}>
                  <InputLabel id='duration-label' required>
                    Duration
                  </InputLabel>
                  <Controller
                    name='durationMinutes'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        label='Duration'
                        labelId='duration-label'
                      >
                        {durationOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.durationMinutes && (
                    <FormHelperText>{errors.durationMinutes?.message}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth error={!!errors.description?.message}>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Description'
                        required
                        multiline
                        rows={3}
                        placeholder='Short description for the service'
                      />
                    )}
                  />
                  {errors.description?.message && (
                    <FormHelperText>{errors.description?.message}</FormHelperText>
                  )}
                  <span className='text-sm text-gray-500'>
                    Information will display on platform
                  </span>
                </FormControl>
              </div>
            </div>
          </>
          <div className='mt-8'>
            <div className='bg-primary-50 p-2 rounded-lg'>
              <Typography variant='h3'>Masters</Typography>
            </div>
            <div className='mt-2'>
              <FormControl fullWidth error={!!errors.masterIds?.message}>
                <Controller
                  name='masterIds'
                  control={control}
                  render={({ field }) => <MasterAutoCompleteSelect masters={masters} {...field} />}
                />
                {errors.masterIds?.message && (
                  <FormHelperText>{errors.masterIds?.message}</FormHelperText>
                )}
              </FormControl>
            </div>
          </div>
          <div id='gallery-upload' className='mt-8'>
            <div className='bg-primary-50 p-2 rounded-lg'>
              <Typography variant='h3'>Gallery</Typography>
            </div>
            <div className='mt-2'>
              <ServiceGalleryUpload
                id='gallery-upload'
                medias={medias}
                onFilePicked={onFilePicked}
                onRemove={onRemoveMedia}
                isUploading={isUploading}
              />
            </div>
          </div>
          <div className='mt-8 flex items-center justify-between'>
            <Typography variant='h5'>Available for online booking</Typography>
            <Controller
              name='isActive'
              control={control}
              render={({ field }) => (
                <>
                  <Switch {...field} defaultChecked />

                  {errors.isActive?.message && (
                    <FormHelperText>{errors.isActive?.message}</FormHelperText>
                  )}
                </>
              )}
            />
          </div>
        </form>
      </div>
      <section id='create-new-service-controls'>
        <div className='w-full flex gap-8 p-2 py-4 justify-center md:justify-end lg:p-8'>
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
    </>
  );
}
