'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useController } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, FormControlLabel, Switch } from '@mui/material';
import type { Dayjs } from 'dayjs';

import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { VALUE_DATE_FORMAT } from '@avoo/constants';
import { exceptionHooks, masterHooks } from '@avoo/hooks';
import { TimeOffMode, timeOffTypes, WholeDay } from '@avoo/hooks/types/timeOffType';
import { validateEndDateFactory } from '@avoo/shared';

import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';
import { getSyncedEndDate } from '@/_utils/timeOffDateSync';

import DateTimePickers from '../DateTimePickers/DateTimePickers';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { FormSelect } from '../FormSelect/FormSelect';
import FormTextarea from '../FormTextArea/FormTextArea';
import ModeToggle from '../ModeToggle/ModeToggle';
import TimeOffConflictsContainer from '../TimeOffConflictsContainer/TimeOffConflictsContainer';

export default function TimeOffAddForm() {
  const t = useTranslations('private.components.TimeOffAddForm.TimeOffAddForm');
  const tTimeOffTypes = useTranslations('private.timeOff.types');
  const {
    data: mastersPages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = masterHooks.useGetMastersInfinite();

  const masters = useMemo<ShortMasterInfo[]>(() => {
    const items = mastersPages?.pages.flatMap((page) => page.data?.items ?? []) ?? [];
    const mastersById = new Map<number, ShortMasterInfo>();

    items.forEach((master) => {
      mastersById.set(master.id, master);
    });

    return Array.from(mastersById.values());
  }, [mastersPages]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const router = useRouter();
  const toast = useToast();
  const timeOffPath = localizationHooks.useWithLocale(AppRoutes.TimeOff);
  const handleNavigateToTimeOff = useCallback(() => {
    router.push(timeOffPath);
  }, [router, timeOffPath]);

  const mastersOptions = [
    { label: t('allStaff'), value: 'all' },
    ...masters.map((master) => ({
      label: master.name ?? t('masterFallback', { id: master.id }),
      value: String(master.id),
    })),
  ];

  const { control, handleSubmit, setValue, watch, errors, isPending, getValues } =
    exceptionHooks.useCreateExceptionForm(({ mastersLabel } = {}) => {
      if (mastersLabel) {
        toast.success(t('timeOffSuccess', { mastersLabel }));
      }
      handleNavigateToTimeOff();
    });

  const values = watch();
  const selectedStaffValues = useMemo(() => values.staff ?? [], [values.staff]);
  const hasSelectedStaff = selectedStaffValues.length > 0;

  const timeOffTypeOptions = useMemo(
    () =>
      timeOffTypes.map(({ value }) => ({
        label: tTimeOffTypes(value),
        value,
      })),
    [tTimeOffTypes],
  );

  const headerLabel = useMemo(() => {
    if (values.mode === TimeOffMode.TimeOff) {
      return (
        timeOffTypeOptions.find((option) => option.value === values.type)?.label ?? t('timeOff')
      );
    }
    return t('workingTime');
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

  const handleStaffChange = useCallback(
    (nextSelected: string[]) => {
      const hasAll = nextSelected.includes('all');
      const selectedMasters = nextSelected.filter((value) => value !== 'all');

      if (hasAll && selectedMasters.length > 0) {
        const prevHasAll = (values.staff ?? []).includes('all');
        return prevHasAll ? selectedMasters : ['all'];
      }

      return nextSelected;
    },
    [values.staff],
  );

  const handleStaffValueChange = useCallback(
    (nextSelected: string[]) => {
      setValue('staff', handleStaffChange(nextSelected), {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [handleStaffChange, setValue],
  );

  return (
    <div className='py-7 px-5 md:px-11 flex-1 min-h-0 w-full flex flex-col'>
      <h2 className='text-[20px] lg:text-[24px] font-semibold'>{t('scheduleException')}</h2>
      <p className='text-xs lg:text-sm text-gray-500'>{t('addTimeOffExtraHours')}</p>

      <ModeToggle value={values.mode} onChange={(mode) => setValue('mode', mode)} />

      <form onSubmit={handleSubmit} className='flex-1 flex flex-col min-h-0'>
        <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-4 -mr-4'>
          <div className='flex flex-col gap-6 md:gap-8 pb-2'>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8'>
              <div className='flex flex-col gap-6 border border-gray-200 rounded-lg p-4'>
                {values.mode === TimeOffMode.TimeOff && (
                  <div className=''>
                    <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                      {t('typeOfTimeOff')}
                    </label>
                    <Controller
                      name='type'
                      control={control}
                      render={({ field, fieldState }) => (
                        <FormSelect
                          id='type'
                          name='type'
                          options={timeOffTypeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                )}

                <div className=''>
                  <label htmlFor='staff' className='block text-sm font-medium text-gray-700'>
                    {t('master')}
                  </label>
                  <FormMultiSelect
                    id='staff'
                    name='staff'
                    options={mastersOptions}
                    selected={selectedStaffValues}
                    onChange={handleStaffValueChange}
                    error={errors.staff?.message}
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
                    label={t('note')}
                    helperText={t('optional')}
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
                            {t('wholeDay')}
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
                            slotProps={{ input: { 'aria-label': t('wholeDayAriaLabel') } }}
                          />
                        }
                      />
                    )}
                  />
                </div>

                <div className='flex flex-col gap-4 p-4'>
                  <div className=''>
                    <label
                      htmlFor='startDate'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      {t('startDate')}
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
                            hasError={Boolean(fieldState.error)}
                            onDateChange={handleStartDateChange}
                            onTimeChange={handleStartTimeChange}
                          />
                          {fieldState.error && (
                            <p className='text-sm text-red-600'>
                              {String(fieldState.error.message)}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className=''>
                    <label
                      htmlFor='endDate'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      {t('endDate')}
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
                            hasError={Boolean(fieldState.error)}
                            onDateChange={handleEndDateChange}
                            onTimeChange={handleEndTimeChange}
                          />
                          {fieldState.error && (
                            <p className='text-sm text-red-600'>
                              {String(fieldState.error.message)}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8'>
              <div className='flex flex-col gap-4'>
                {hasSelectedStaff ? (
                  <TimeOffConflictsContainer values={values} masters={masters} />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className='w-full mt-6 flex justify-between md:justify-end items-end gap-6 md:gap-8'>
          <Button
            onClick={handleCancel}
            color='secondary'
            variant='outlined'
            sx={{ width: { xs: 130, md: 170 }, height: 45 }}
          >
            {t('cancel')}
          </Button>
          <Button
            type='submit'
            color='secondary'
            variant='contained'
            sx={{ width: { xs: 130, md: 170 }, height: 45 }}
            disabled={isPending}
          >
            {t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
