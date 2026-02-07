import React, { useEffect } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import dayjs from 'dayjs';
import { masterHooks, scheduleHooks } from '@avoo/hooks';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { DateSelect } from '../DateSelect/DateSelect';
import FormInput from '../FormInput/FormInput';
import { getAllErrorMessages } from '@/_utils/formError';
import { WorkingDayRow } from '../WorkingDayRow/WorkingDayRow';
import { Button } from '@mui/material';
import { useToast } from '@/_hooks/useToast';
import { END_MINUTE, SCHEDULE_OPTIONS, START_MINUTE } from '@avoo/constants/src/calendar';
import { timeUtils } from '@avoo/shared';

export const ScheduleAddForm = () => {
  const toast = useToast();

  const { control, register, handleSubmit, setValue, watch, errors } =
    scheduleHooks.useCreateScheduleForm({
      onSuccess: () => {
        toast.success('Schedule added successfully');
      },
      onError: (error) => {
        toast.error(`Schedule add failed: ${error.message}`);
      },
    });

  const { fields, replace, append } = useFieldArray({
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
  };

  const errorsList = getAllErrorMessages(errors);

  return (
    <>
      <form id='create-new-schedule' className='space-y-6 mt-8' onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-4 relative'>
          <div className='lg:overflow-visible lg:border lg:border-gray-200 lg:gap-0 lg:rounded-lg lg:p-4 lg:overflow-x-hidden lg:h-max'>
            <div className='flex flex-col gap-4'>
              <FormInput {...register('name')} label='Name' />

              <Controller
                name='patternType'
                control={control}
                defaultValue='weekly'
                render={({ field }) => (
                  <FormSelect
                    name='patternType'
                    label='Type'
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
                name='mastersIds'
                control={control}
                render={({ field }) => (
                  <FormMultiSelect
                    name='mastersIds'
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
                  <DateSelect
                    name='startAt'
                    label='Start date'
                    value={dayjs(field.value)}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              <Controller
                name='endAt'
                control={control}
                render={({ field }) => (
                  <DateSelect
                    name='startAt'
                    label='End date'
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>
          </div>

          <div className='border border-gray-200'>
            <p className='mb-8 font-medium'>Schedule {scheduleType}</p>
            <div className='flex flex-col'>
              {fields.map((field, index) => (
                <WorkingDayRow
                  key={field.id}
                  index={index}
                  control={control}
                  watch={watch}
                  scheduleType={scheduleType}
                  setValue={setValue}
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

        {errorsList.length > 0 && (
          <div className='text-red-600 text-sm space-y-1'>
            {errorsList.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}
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
