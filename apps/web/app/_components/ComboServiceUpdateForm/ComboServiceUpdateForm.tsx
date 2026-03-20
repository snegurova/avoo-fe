import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { Combination } from '@avoo/axios/types/apiTypes';
import { combinationHooks, masterHooks } from '@avoo/hooks';

import ComboServiceSelector from '@/_components/ComboServiceSelector/ComboServiceSelector';
import FormCounter from '@/_components/FormCounter/FormCounter';
import MasterAutocompleteCardSelect from '@/_components/MasterAutoCompleteCardSelect/MasterAutoCompleteCardSelect';
import { useToast } from '@/_hooks/useToast';
import { getAllErrorMessages } from '@/_utils/formError';

type Props = {
  combination: Combination;
  onCancel: () => void;
  onClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export default function ComboServiceUpdateForm(props: Props) {
  const t = useTranslations('private.components.ComboServiceUpdateForm.ComboServiceUpdateForm');
  const { combination, onCancel, onDirtyChange, onClose } = props;
  const toast = useToast();

  const { masters, searchTerm, setSearchTerm } = masterHooks.useMasterQuery();

  const { control, setValue, handleSubmit, errors, isDirty } =
    combinationHooks.useUpdateCombinationForm({
      defaultValue: combination,
      onSuccess: () => {
        toast.success(t('updateSuccess'));
        onClose();
      },
      onError: (error) => {
        toast.error(t('updateError', { message: error.message }));
      },
    });

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const errorsList = getAllErrorMessages(errors);

  return (
    <>
      <form
        id='update-combo-service'
        className='mt-8 lg:mt-0 flex flex-col flex-1 gap-4 pr-8 pb-4'
        onSubmit={handleSubmit}
      >
        {errorsList.length > 0 && (
          <div className='text-red-600 text-sm space-y-1'>
            {errorsList.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}
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
                label={t('comboServiceName')}
              />
            )}
          />
          {errors.name?.message && <FormHelperText>{errors.name?.message}</FormHelperText>}
        </FormControl>
        <div className='mt-2'>
          <div className='bg-primary-50 p-2 rounded-lg'>
            <Typography variant='h4'>{t('masters')}</Typography>
          </div>
          <div className='mt-2'>
            <FormControl fullWidth error={!!errors.masterIds?.message}>
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
            </FormControl>
          </div>
        </div>
        <div className='mt-2'>
          <div className='bg-primary-50 p-2 rounded-lg'>
            <Typography variant='h4'>{t('services')}</Typography>
          </div>
          <div className='mt-2'>
            <FormControl fullWidth error={!!errors.serviceIds?.message}>
              <Controller
                name='serviceIds'
                control={control}
                render={({ field }) => (
                  <ComboServiceSelector
                    items={combination.services}
                    value={field.value}
                    variant='modal'
                    onChange={field.onChange}
                    onDurationChange={(duration) => setValue('durationMinutes', duration)}
                  />
                )}
              />
              {errors.masterIds?.message && (
                <FormHelperText>{errors.masterIds?.message}</FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
        <FormControl fullWidth error={!!errors.durationMinutes}>
          <Controller
            name='durationMinutes'
            control={control}
            render={({ field }) => (
              <div className=''>
                <InputLabel id='duration-label' required>
                  {t('serviceTotalDuration')}
                </InputLabel>
                <FormCounter
                  value={field.value}
                  onIncrease={() => field.onChange(field.value ? field.value + 5 : 0)}
                  onDecrease={() =>
                    field.onChange(field.value && field.value > 5 ? field.value - 5 : 0)
                  }
                />
              </div>
            )}
          />

          {errors.durationMinutes && (
            <FormHelperText>{errors.durationMinutes?.message}</FormHelperText>
          )}
        </FormControl>

        <div className='mt-2 flex items-center justify-between'>
          <Typography variant='h5'>{t('availableOnline')}</Typography>
          <Controller
            name='isActive'
            control={control}
            render={({ field }) => (
              <>
                <Switch {...field} checked={field.value} />
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
          {t('cancel')}
        </Button>
        <Button
          form='update-combo-service'
          type='submit'
          color='secondary'
          variant='contained'
          disabled={!isDirty}
        >
          {t('edit')}
        </Button>
      </div>
    </>
  );
}
