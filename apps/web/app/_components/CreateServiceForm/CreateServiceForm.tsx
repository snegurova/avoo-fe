import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import { Control, Controller, UseFormSetValue, useWatch } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form';
import { Category } from '@avoo/axios/types/apiTypes';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { timeUtils } from '@avoo/shared';
import { CreateServiceFormData } from '@avoo/hooks';
import MasterSelect from '@/_components/MasterSelect/MasterSelect';
import CategorySelect from '@/_components/CategorySelect/CategorySelect';
import MasterSelectCard from '@/_components/MasterSelectCard/MasterSelectCard';

type Props = {
  id: string;
  categories: Category[];
  masters: MasterWithRelationsEntityResponse[];
  control: Control<CreateServiceFormData>;
  errors: FieldErrors<CreateServiceFormData>;
  children: React.ReactNode;
  setValue: UseFormSetValue<CreateServiceFormData>;
  onSubmit?: () => void;
};

export default function CreateServiceForm(props: Props) {
  const { id, children, control, errors, categories, masters, onSubmit, setValue } = props;
  const masterIds = useWatch<CreateServiceFormData, 'masterIds'>({
    control,
    name: 'masterIds',
  });

  const mastersById = useMemo(() => {
    return new Map(masters.map((m) => [m.id, m]));
  }, [masters]);

  const selectedMasters = useMemo(() => {
    return masterIds
      ?.map((id) => mastersById.get(id))
      .filter((m): m is MasterWithRelationsEntityResponse => m != null);
  }, [masterIds, mastersById]);

  const handleRemoveMaster = (id: number) => {
    setValue(
      'masterIds',
      masterIds?.filter((masterId) => masterId !== id),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const durationOptions = timeUtils.getDurationOptionsRange(15, 300, 15);

  return (
    <form id={id} onSubmit={onSubmit}>
      <>
        <Typography variant='h3'>Basic detail</Typography>
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-8'>
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
          </div>
        </div>
      </>
      <div className='mt-8'>
        <Typography variant='h3'>Masters</Typography>
        <div className='grid grid-cols-2 gap-8 mt-4'>
          <MasterSelect
            control={control}
            error={errors.masterIds?.message || ''}
            masters={masters}
          />
        </div>
        <ul id='masters-list' className='flex gap-4 mt-6'>
          {selectedMasters?.map((master) => (
            <li key={master.id}>
              <MasterSelectCard
                id={master.id}
                name={master.name || ''}
                specialty={master.headline || ''}
                avatarUrl={(master.avatarUrl ?? master.avatarPreviewUrl) || ''}
                onRemove={handleRemoveMaster}
              />
            </li>
          ))}
        </ul>
      </div>
      <div id='gallery-upload' className='mt-8'>
        <div className='bg-primary-50 p-2 rounded-lg'>
          <Typography variant='h3'>Gallery</Typography>
        </div>
        <div className='mt-2'>{children}</div>
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
  );
}
