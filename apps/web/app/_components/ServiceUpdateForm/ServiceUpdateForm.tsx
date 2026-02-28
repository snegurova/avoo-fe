import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
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
import { Service, UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { categoriesHooks, masterHooks, mediaHooks, servicesHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import CategorySelect from '@/_components/CategorySelect/CategorySelect';
import MasterAutoCompleteSelect from '@/_components/MasterAutoCompleteSelect/MasterAutoCompleteSelect';
import ServiceGalleryUpload from '@/_components/ServiceGalleryUpload/ServiceGalleryUpload';
import { useToast } from '@/_hooks/useToast';
import { getAllErrorMessages } from '@/_utils/formError';

type Props = {
  service: Service;
  onCancel: () => void;
};

export default function ServiceUpdateForm(props: Props) {
  const { service, onCancel } = props;
  const toast = useToast();
  const categories = categoriesHooks.useGetPublicCategories();

  const masters =
    masterHooks
      .useGetMastersInfinite({ search: '' })
      .data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  const durationOptions = timeUtils.getDurationOptionsRange(15, 300, 15);

  const [addedMedias, setAddedMedias] = useState<UploadMediaResponse[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);

  const { data, fetchNextPage, hasNextPage } = mediaHooks.useGetMediaInfinite({
    limit: 9,
    type: MEDIA_TYPE_ENUM.SERVICE,
    typeEntityId: service.id,
  });

  const persistedMedias = data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  const visibleMedias = [
    ...addedMedias,
    ...persistedMedias.filter((m) => !removedMediaIds.includes(m.id)),
  ];

  const { control, setValue, getValues, handleSubmit, errors } = servicesHooks.useUpdateServiceForm(
    {
      service,
      onSuccess: () => {
        toast.success('Service has been updated!');
        onCancel();
      },
      onError: (error) => {
        toast.error('Failed to update service: ' + error.message);
      },
    },
  );

  const { uploadMedia, isUploading } = mediaHooks.useUploadMedia({
    onSuccess: (data) => {
      toast.success('Media has been uploaded!');
      setAddedMedias((prev) => [data, ...prev]);
      setValue('mediaIds', [...getValues('mediaIds'), data.id]);
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

  const { deleteMedia } = mediaHooks.useDeleteMedia({
    onSuccess: (mediaId) => {
      setRemovedMediaIds((prev) => [...prev, mediaId]);
      setAddedMedias((prev) => prev.filter((media) => media.id !== mediaId));
      setValue(
        'mediaIds',
        getValues('mediaIds').filter((id) => id !== mediaId),
      );
      toast.success('Media has been deleted!');
    },
    onError: (error) => {
      toast.error('Failed to delete media: ' + error.message);
    },
  });

  const onRemoveMedia = (id: number) => {
    if (addedMedias.find((media) => media.id === id)) {
      setAddedMedias((prev) => prev.filter((media) => media.id !== id));
      setValue(
        'mediaIds',
        getValues('mediaIds').filter((mediaId) => mediaId !== id),
      );
      toast.success('Media has been removed!');
      return;
    }
    deleteMedia({
      mediaId: id,
      params: { type: MEDIA_TYPE_ENUM.SERVICE, typeEntityId: service.id },
    });
  };
  const errorsList = getAllErrorMessages(errors);

  return (
    <>
      <form
        id='update-service'
        className='mt-8 lg:mt-0 flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        {errorsList.length > 0 && (
          <div className='text-red-600 text-sm space-y-1'>
            {errorsList.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}
        <Typography variant='h3'>Basic detail</Typography>
        <FormControl fullWidth error={!!errors.name?.message}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <TextField {...field} required fullWidth value={field.value ?? ''} label='Title' />
            )}
          />
          {errors.name?.message && <FormHelperText>{errors.name?.message}</FormHelperText>}
        </FormControl>

        <CategorySelect
          categories={categories || []}
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
          {errors.price?.message && <FormHelperText>{errors.price?.message}</FormHelperText>}
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
                value={field.value}
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
          <span className='text-sm text-gray-500'>Information will display on platform</span>
        </FormControl>

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
              medias={visibleMedias}
              onFilePicked={onFilePicked}
              onRemove={(id) => onRemoveMedia(id)}
              isUploading={isUploading}
              isSmall={true}
              addButtonPosition='first'
            />
          </div>
          {hasNextPage && (
            <div className='mt-2'>
              <Button
                color='primary'
                variant='outlined'
                onClick={() => fetchNextPage()}
                fullWidth
                disabled={!hasNextPage}
                className='mt-4'
              >
                Load more
              </Button>
            </div>
          )}
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
      <div className='sticky bottom-0 z-20 pt-4 bg-white flex items-center justify-end gap-4'>
        <Button color='secondary' variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <Button form='update-service' type='submit' color='secondary' variant='contained'>
          Edit
        </Button>
      </div>
    </>
  );
}
