import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { Button, TextField } from '@mui/material';

import { END_MINUTE, SCHEDULE_OPTIONS, START_MINUTE } from '@avoo/constants/src/calendar';
import { masterHooks, scheduleHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import { FormSelect } from '@/_components/FormSelect/FormSelect';
import { FormMultiSelect } from '@/_components/FormMultiSelect/FormMultiSelect';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import { WorkingDayRow } from '@/_components/WorkingDayRow/WorkingDayRow';
import { appRoutes } from '@/_routes/routes';
import { getAllErrorMessages } from '@/_utils/formError';
import { useToast } from '@/_hooks/useToast';
import { VALUE_DATE_FORMAT } from '@/_constants/dateFormats';

export const ScheduleAddForm = () => {
  const toast = useToast();

  const router = useRouter();

  const { control, handleSubmit, setValue, watch, errors } = scheduleHooks.useCreateScheduleForm({
    onSuccess: () => {
      toast.success('Schedule added successfully');
      router.replace(appRoutes.WorkingHours);
    },
    onError: (error) => {
      toast.error(`Schedule add failed: ${error.message}`);
    },
  });

  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: 'workingHours',
  });

  const masters = masterHooks.useGetMastersProfileInfo();

  const scheduleType = watch('patternType');

  const mastersOptions =
    masters?.items?.map((m) => ({
      label: m.name ?? `Master #${m.id}`,
      value: m.id.toString(),
    })) ?? [];

  useEffect(() => {
    if (!scheduleType) return;

    const selectedOption = SCHEDULE_OPTIONS.find((option) => option.value === scheduleType);
    if (!selectedOption) return;

    setValue('pattern', selectedOption.pattern);
    const newDays = Array.from({ length: selectedOption.pattern }).map((_, index) => ({
      day: index + 1,
      enabled: selectedOption.daysOn.includes(index + 1),
      startTimeMinutes: selectedOption.daysOn.includes(index + 1) ? START_MINUTE : 0,
      endTimeMinutes: selectedOption.daysOn.includes(index + 1) ? END_MINUTE : 0,
      breaks: [],
    }));

    replace(newDays);
  }, [scheduleType]);

  const appendDay = () => {
    const newDay = {
      day: fields.length + 1,
      enabled: true,
      startTimeMinutes: START_MINUTE,
      endTimeMinutes: END_MINUTE,
      breaks: [],
    };
    append(newDay);
    setValue('pattern', fields.length + 1);
  };

  const errorsList = getAllErrorMessages(errors);

  return (
    <>
      <form
        id='create-new-schedule'
        className='space-y-6 mt-8 overflow-y-auto'
        onSubmit={handleSubmit}
      >
        <div className='grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-4'>
          <div className='lg:overflow-visible lg:border lg:border-gray-200 lg:gap-0 lg:rounded-lg lg:p-4 lg:overflow-x-hidden lg:h-max'>
            <div className='flex flex-col gap-4'>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    value={field.value ?? ''}
                    label='Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name='patternType'
                control={control}
                defaultValue='weekly'
                render={({ field }) => (
                  <FormSelect
                    error={!!errors.patternType}
                    name='patternType'
                    label='Type'
                    required
                    options={SCHEDULE_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      const selectedOption = SCHEDULE_OPTIONS.find(
                        (option) => option.value === value,
                      );
                      if (selectedOption) {
                        setValue('pattern', selectedOption.pattern);
                      }
                    }}
                  />
                )}
              />

              <Controller
                name='masterIds'
                control={control}
                render={({ field }) => (
                  <FormMultiSelect
                    error={!!errors.masterIds}
                    required
                    name='masterIds'
                    label='Apply to'
                    options={mastersOptions}
                    selected={((field.value ?? []) as number[]).map((v) => v.toString())}
                    onChange={(values) => field.onChange(values.map((v) => Number(v)))}
                  />
                )}
              />

              <Controller
                name='startAt'
                control={control}
                defaultValue={timeUtils.getNextMonday(new Date())}
                render={({ field }) => (
                  <FormDatePicker
                    error={errors.startAt?.message}
                    label='Start date'
                    valueFormat={VALUE_DATE_FORMAT}
                    required
                    date={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              <Controller
                name='endAt'
                control={control}
                render={({ field }) => (
                  <FormDatePicker
                    error={errors.endAt?.message}
                    label='End date'
                    valueFormat={VALUE_DATE_FORMAT}
                    date={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>
            {errorsList.length > 0 && (
              <div className='text-red-600 text-sm space-y-1'>
                {errorsList.map((msg, idx) => (
                  <p key={idx}>{msg}</p>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className='mb-8 font-medium'>Schedule {scheduleType}</p>
            <div className='flex flex-col gap-4'>
              {fields.map((field, index) => (
                <WorkingDayRow
                  key={field.id}
                  index={index}
                  control={control}
                  watch={watch}
                  scheduleType={scheduleType}
                  setValue={setValue}
                  onRemove={() => remove(index)}
                  disabledRemove={index === 0 && fields.length === 1}
                />
              ))}
              {scheduleType === 'custom' && (
                <Button variant='outlined' sx={{ mt: 2 }} onClick={appendDay}>
                  Add day
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
      <section id='create-new-schedule-controls'>
        <div className='w-full flex gap-8 justify-end p-8'>
          <Button color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button form='create-new-schedule' type='submit' color='secondary' variant='contained'>
            Save
          </Button>
        </div>
      </section>
    </>
  );
};
