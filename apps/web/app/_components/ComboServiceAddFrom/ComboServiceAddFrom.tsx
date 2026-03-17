import { Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { combinationHooks, masterHooks } from '@avoo/hooks';

import ComboServiceSelector from '@/_components/ComboServiceSelector/ComboServiceSelector';
import FormCounter from '@/_components/FormCounter/FormCounter';
import MasterAutocompleteCardSelect from '@/_components/MasterAutoCompleteCardSelect/MasterAutoCompleteCardSelect';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';
import { getAllErrorMessages } from '@/_utils/formError';

export default function ComboServiceAddForm() {
  const router = useRouter();
  const toast = useToast();
  const comboServicePath = localizationHooks.useWithLocale(AppRoutes.ComboServiceTime);
  const { masters, searchTerm, setSearchTerm } = masterHooks.useMasterQuery();

  const { control, watch, setValue, handleSubmit, errors } =
    combinationHooks.useCreateCombinationForm({
      onSuccess: () => {
        toast.success('Service has been created!');
        router.replace(comboServicePath);
      },
      onError: (error) => {
        toast.error('Failed to create service: ' + error.message);
      },
    });

  const selectedServices = watch('serviceIds');
  const currentComboName = watch('name');
  const masterIds = watch('masterIds');
  const errorsList = getAllErrorMessages(errors);

  return (
    <div className='flex flex-col h-full relative overflow-hidden'>
      <div className='flex-1 overflow-y-auto overflow-x-hidden pr-3 pb-8'>
        {errorsList.length > 0 && (
          <div className='text-red-600 text-sm space-y-1'>
            {errorsList.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}
        <form id='add-combo-service' onSubmit={handleSubmit}>
          <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div>
              <FormControl fullWidth error={!!errors.name?.message}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      value={field.value}
                      label='Combo service name'
                    />
                  )}
                />
                {errors.name?.message && <FormHelperText>{errors.name?.message}</FormHelperText>}
              </FormControl>
              <div className='mt-4'>
                <div className='bg-primary-50 p-2 rounded-lg'>
                  <Typography variant='h6' className='font-semibold'>
                    Masters *
                  </Typography>
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
            </div>

            <div>
              <FormControl fullWidth error={!!errors.serviceIds?.message}>
                <Controller
                  name='serviceIds'
                  control={control}
                  render={({ field }) => (
                    <ComboServiceSelector
                      value={field.value}
                      masterIds={masterIds}
                      onChange={field.onChange}
                      items={null}
                      currentComboName={currentComboName}
                      onDurationChange={(duration) => setValue('durationMinutes', duration)}
                      onGenerateName={(newName) => setValue('name', newName)}
                    />
                  )}
                />
                {errors.serviceIds?.message && (
                  <FormHelperText>{errors.serviceIds?.message}</FormHelperText>
                )}
              </FormControl>
              {selectedServices.length >= 2 ? (
                <FormControl fullWidth error={!!errors.durationMinutes}>
                  <Controller
                    name='durationMinutes'
                    control={control}
                    render={({ field }) => (
                      <div className='mt-2'>
                        <InputLabel id='duration-label' required>
                          Service total duration
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
              ) : (
                <Alert severity='info' sx={{ width: '100%', mt: 2 }}>
                  Select at least 2 service per combination
                </Alert>
              )}
              <div className='mt-8 flex items-center justify-between'>
                <Typography variant='h5'>Available for online booking</Typography>
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
            </div>
          </div>
        </form>
      </div>
      <section id='create-new-service-controls' className='shrink-0 bg-white z-10'>
        <div className='w-full flex gap-8 p-4 pr-3 justify-center md:justify-end  lg:pr-3'>
          <Button color='secondary' variant='outlined' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button form='add-combo-service' type='submit' color='secondary' variant='contained'>
            Add
          </Button>
        </div>
      </section>
    </div>
  );
}
