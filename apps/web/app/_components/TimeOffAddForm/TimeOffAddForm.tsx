'use client';
import React, { useCallback, useMemo } from 'react';
import type { Dayjs } from 'dayjs';
import { VALUE_DATE_FORMAT } from '@/_constants/dateFormats';
import { Button, Switch, FormControlLabel } from '@mui/material';
import FormTextarea from '../FormTextArea/FormTextArea';
import { validateEndDateFactory } from '@avoo/shared';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import DateTimePickers from '../DateTimePickers/DateTimePickers';
import ModeToggle from '../ModeToggle/ModeToggle';
import { useController, Controller } from 'react-hook-form';
import { masterHooks, exceptionHooks } from '@avoo/hooks';
import { useRouter } from 'next/navigation';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';
import { getSyncedEndDate } from '@/_utils/timeOffDateSync';
import {
  TimeOffMode,
  timeOffTypes,
  timeOffTypeLabels,
  WholeDay,
} from '@avoo/hooks/types/timeOffType';
import { localizationHooks } from '@/_hooks/localizationHooks';

export default function TimeOffAddForm() {
  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const router = useRouter();
  const toast = useToast();
  const timeOffPath = localizationHooks.useWithLocale(AppRoutes.TimeOff);
  const handleNavigateToTimeOff = useCallback(() => {
    router.push(timeOffPath);
  }, [router, timeOffPath]);

  const mastersOptions = [
    { label: 'All Staff', value: 'all' },
    ...(masters?.map((master) => ({
      label: master.name ?? `Master #${master.id}`,
      value: String(master.id),
    })) ?? []),
  ];

  const { control, handleSubmit, setValue, watch, errors, isPending, getValues } =
    exceptionHooks.useCreateExceptionForm(({ mastersLabel } = {}) => {
      if (mastersLabel) {
        toast.success(`Time off for ${mastersLabel} added successfully`);
      }
      handleNavigateToTimeOff();
    });

  const values = watch();

  const timeOffTypeOptions = useMemo(
    () =>
      timeOffTypes.map(({ value }) => ({
        label: timeOffTypeLabels[value],
        value,
      })),
    [],
  );

  const headerLabel = useMemo(() => {
    if (values.mode === TimeOffMode.TimeOff) {
      return timeOffTypeOptions.find((option) => option.value === values.type)?.label ?? 'Time off';
    }
    return 'Working time';
  }, [values.mode, values.type, timeOffTypeOptions]);

  const handleStartTimeChange = useCallback(
    (newTime: Dayjs | null) => {
      setValue('startTime', newTime ? newTime.format('HH:mm') : '');
    },
    [setValue],
  );

  const handleEndTimeChange = useCallback(
    (newTime: Dayjs | null) => setValue('endTime', newTime ? newTime.format('HH:mm') : ''),
    [setValue],
  );
  const { field: noteField } = useController({ name: 'note', control });
  const handleStartDateChange = useCallback(
    (newDate: Dayjs | null) => {
      const nextStartDate = newDate ? newDate.format(VALUE_DATE_FORMAT) : '';
      setValue('startDate', nextStartDate);

      const syncedEndDate = getSyncedEndDate(nextStartDate, getValues('endDate'));
      if (syncedEndDate) setValue('endDate', syncedEndDate);
    },
    [setValue, getValues],
  );

  const handleEndDateChange = useCallback(
    (newDate: Dayjs | null) =>
      setValue('endDate', newDate ? newDate.format(VALUE_DATE_FORMAT) : ''),
    [setValue],
  );
  const handleCancel = useCallback(() => {
    handleNavigateToTimeOff();
  }, [handleNavigateToTimeOff]);

  return (
    <div className='py-7 px-5 md:px-11 flex-1 min-h-0 overflow-auto hide-scrollbar max-w-4xl xl:max-w-screen-xl xl:mx-auto'>
      <h2 className='text-[20px] lg:text-[24px] font-semibold'>Schedule exception</h2>
      <p className='text-xs lg:text-sm text-gray-500'>
        Add time off or extra working hours for a master
      </p>

      <ModeToggle value={values.mode} onChange={(mode) => setValue('mode', mode)} />

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='flex flex-col gap-6 border border-gray-200 rounded-lg p-4'>
          {values.mode === TimeOffMode.TimeOff && (
            <div className=''>
              <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                Type of Time off *
              </label>
              <Controller
                name='type'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormSelect
                      id='type'
                      name='type'
                      options={timeOffTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <p className='text-sm text-red-600'>{String(fieldState.error.message)}</p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          <div className=''>
            <label htmlFor='staff' className='block text-sm font-medium text-gray-700'>
              Master *
            </label>
            <Controller
              name='staff'
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <FormMultiSelect
                    id='staff'
                    name='staff'
                    options={mastersOptions}
                    selected={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error && (
                    <p className='text-sm text-red-600'>{String(fieldState.error.message)}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <FormTextarea
              id='note'
              name={noteField.name}
              value={noteField.value ?? ''}
              onChange={noteField.onChange}
              onBlur={noteField.onBlur}
              ref={noteField.ref}
              label='Note'
              helperText='Optional'
              maxLength={200}
              error={errors.note?.message}
              classNames={{
                textarea:
                  'block w-full text-sm text-gray-600 border border-gray-200 p-3 rounded-lg min-h-[50px] focus:outline-none focus:ring-1 focus:ring-purple-800',
              }}
            />
          </div>
        </div>

        <div className='flex flex-col gap-6 border border-gray-200 rounded-lg'>
          <div className='h-12 w-full flex items-center justify-between px-3 bg-primary-50'>
            <h3>{headerLabel}</h3>
            <Controller
              name='wholeDay'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  labelPlacement='start'
                  label={
                    <div style={{ marginRight: 10 }} className='text-gray-600 text-xs'>
                      Whole day
                    </div>
                  }
                  control={
                    <Switch
                      size='small'
                      color='primary'
                      checked={field.value === WholeDay.Whole}
                      onChange={(_e, checked) =>
                        field.onChange(checked ? WholeDay.Whole : WholeDay.Partial)
                      }
                      slotProps={{ input: { 'aria-label': 'whole day' } }}
                    />
                  }
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-4 p-4'>
            <div className=''>
              <label htmlFor='startDate' className='block text-sm font-medium text-gray-700 mb-1'>
                Start Date *
              </label>
              <Controller
                name='startDate'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <DateTimePickers
                      dateValue={field.value}
                      timeValue={values.startTime}
                      wholeDay={values.wholeDay === WholeDay.Whole}
                      onDateChange={handleStartDateChange}
                      onTimeChange={handleStartTimeChange}
                    />
                    {fieldState.error && (
                      <p className='text-sm text-red-600'>{String(fieldState.error.message)}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className=''>
              <label htmlFor='endDate' className='block text-sm font-medium text-gray-700 mb-1'>
                End Date *
              </label>
              <Controller
                name='endDate'
                control={control}
                rules={{ validate: validateEndDateFactory(getValues) }}
                render={({ field, fieldState }) => (
                  <>
                    <DateTimePickers
                      dateValue={field.value}
                      timeValue={values.endTime}
                      wholeDay={values.wholeDay === WholeDay.Whole}
                      onDateChange={handleEndDateChange}
                      onTimeChange={handleEndTimeChange}
                    />
                    {fieldState.error && (
                      <p className='text-sm text-red-600'>{String(fieldState.error.message)}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-between'>
          <Button
            onClick={handleCancel}
            color='secondary'
            variant='outlined'
            sx={{ width: { xs: 130, md: 170 }, height: 45 }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            color='secondary'
            variant='contained'
            sx={{ width: { xs: 130, md: 170 }, height: 45 }}
            disabled={isPending}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
