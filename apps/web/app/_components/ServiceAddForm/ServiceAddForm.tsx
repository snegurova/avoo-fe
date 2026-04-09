import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
  useMediaQuery,
} from '@mui/material';

import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { Category, UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import { masterHooks, mediaHooks, servicesHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import CategorySelect from '@/_components/CategorySelect/CategorySelect';
import ConfirmationDialog from '@/_components/ConfirmationDialog/ConfirmationDialog';
import MasterAutocompleteCardSelect from '@/_components/MasterAutoCompleteCardSelect/MasterAutoCompleteCardSelect';
import ServiceGalleryUpload from '@/_components/ServiceGalleryUpload/ServiceGalleryUpload';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  categories: Category[];
  className?: string;
};

export default function ServiceAddForm(props: Props) {
  const t = useTranslations('private.components.ServiceAddForm.ServiceAddForm');
  const tCommon = useTranslations('private.common');
  const locale = localizationHooks.useGetLocale();

  const { categories, className } = props;

  const router = useRouter();
  const toast = useToast();

  const { masters, searchTerm, setSearchTerm } = masterHooks.useMasterQuery();

  const durationOptions = timeUtils.getDurationOptionsRange(15, 300, 5, locale);

  const [medias, setMedias] = useState<UploadMediaResponse[]>([]);
  const servicePath = localizationHooks.useWithLocale(AppRoutes.Services);

  const isMobile = useMediaQuery('(max-width: 767px)');

  const { uploadMedia, isUploading } = mediaHooks.useUploadMedia({
    onSuccess: (data) => {
      toast.success(t('mediaUploaded'));
      setValue('mediaIds', [...getValues('mediaIds'), data.id]);
      setMedias([...medias, data]);
    },
    onError: (error) => {
      toast.error(t('mediaUploadError', { error: error.message }));
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
    toast.info(t('mediaRemoved', { id }));
    setMedias(medias.filter((media) => media.id !== id));
  };

  const { control, setValue, getValues, handleSubmit, isDirty, errors, isValid, touchedFields } =
    servicesHooks.useCreateServiceForm({
      onSuccess: () => {
        toast.success(t('serviceCreated'));
        router.replace(servicePath);
      },
      onError: (error) => {
        toast.error(t('serviceCreateError', { error: error.message }));
      },
    });

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleCancel = () => {
    if (isDirty) {
      setOpenConfirmDialog(true);
    } else {
      router.back();
    }
  };

  const handleConfirmLeave = () => {
    setOpenConfirmDialog(false);
    router.back();
  };

  return (
    <div className={className}>
      <div className='overflow-y-auto h-[calc(100vh-385px)]'>
        <form id='create-new-service' onSubmit={handleSubmit} className='mt-8 lg:mt-0'>
          <>
            <Typography variant='fromSectionTitle'>{t('basicDetail')}</Typography>
            <div className='mt-4'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <FormControl fullWidth error={!!errors.name && touchedFields.name}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        value={field.value ?? ''}
                        label={t('title')}
                      />
                    )}
                  />
                  {touchedFields.name && errors.name?.message && (
                    <FormHelperText>{errors.name?.message}</FormHelperText>
                  )}
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
                        label={t('price')}
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
                    {t('duration')}
                  </InputLabel>
                  <Controller
                    name='durationMinutes'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        label={t('duration')}
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

                <FormControl
                  fullWidth
                  error={!!errors.description?.message && touchedFields.description}
                >
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('description')}
                        required
                        multiline
                        rows={3}
                        placeholder={t('shortDescription')}
                      />
                    )}
                  />
                  {touchedFields.description && errors.description?.message && (
                    <FormHelperText>{errors.description?.message}</FormHelperText>
                  )}
                  <span className='text-sm text-gray-500'>{t('infoWillDisplay')}</span>
                </FormControl>
              </div>
            </div>
          </>
          <FormControl fullWidth required error={!!errors.masterIds?.message} sx={{ mt: 4 }}>
            <div className='bg-primary-50 p-2 rounded-lg'>
              <InputLabel
                required
                sx={{ fontSize: '20px', fontWeight: '500', margin: 0, letterSpacing: '0.04em' }}
              >
                {t('masters')}
              </InputLabel>
            </div>
            <div className='mt-2'>
              <Controller
                name='masterIds'
                control={control}
                render={({ field }) => (
                  <MasterAutocompleteCardSelect
                    masters={masters}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    {...field}
                  />
                )}
              />
              {errors.masterIds?.message && (
                <FormHelperText>{errors.masterIds?.message}</FormHelperText>
              )}
            </div>
          </FormControl>

          <div id='gallery-upload' className='mt-8'>
            <div className='bg-primary-50 p-2 rounded-lg'>
              <Typography variant='fromSectionTitle'>{t('gallery')}</Typography>
            </div>
            <div className='mt-2'>
              <ServiceGalleryUpload
                id='gallery-upload'
                medias={medias}
                onFilePicked={onFilePicked}
                onRemove={onRemoveMedia}
                isUploading={isUploading}
                isSmall={isMobile}
              />
            </div>
          </div>
          <div className='mt-8 flex items-center'>
            <Typography variant='h5'>{t('availableOnline')}</Typography>
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
          <Button color='secondary' variant='outlined' onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button
            form='create-new-service'
            type='submit'
            color='secondary'
            variant='contained'
            disabled={isUploading || !isValid}
          >
            {t('save')}
          </Button>
        </div>
      </section>
      <ConfirmationDialog
        open={!!openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        title={tCommon('areYouSureYouWantToLeaveThisPage')}
        content={tCommon('youHaveUnsavedChanges')}
        cancelText={tCommon('cancel')}
        confirmText={tCommon('leave')}
        onCancel={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirmLeave}
        loading={false}
      />
    </div>
  );
}
