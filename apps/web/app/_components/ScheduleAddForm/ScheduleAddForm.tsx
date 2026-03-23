import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, TextField } from '@mui/material';

import {
  END_MINUTE,
  SCHEDULE_ERRORS,
  SCHEDULE_OPTIONS,
  START_MINUTE,
  VALUE_DATE_FORMAT,
} from '@avoo/constants';
import { masterHooks, scheduleHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import ConfirmationDialog from '@/_components/ConfirmationDialog/ConfirmationDialog';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import { FormSearchAutocomplete } from '@/_components/FormSearchAutocomplete/FormSearchAutoComplete';
import { FormSelect } from '@/_components/FormSelect/FormSelect';
import { ConflictScheduleDialog } from '@/_components/ScheduleAddForm/ConflictScheduleDialog';
import { CreateWorkingDayRow } from '@/_components/ScheduleAddForm/CreateWorkingDayRow';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';
import { getAllErrorMessages } from '@/_utils/formError';

export const ScheduleAddForm = () => {
  const t = useTranslations('private.components.ScheduleAddForm.ScheduleAddForm');
  const tCommon = useTranslations('private.common');
  const toast = useToast();

  const router = useRouter();
  const workingHoursPath = localizationHooks.useWithLocale(AppRoutes.WorkingHours);

  const [conflictIds, setConflictIds] = useState<number[]>([]);
  const [openConflictDialog, setOpenConflictDialog] = useState(false);

  const { control, handleSubmit, setValue, watch, errors, isDirty, isValid, touchedFields } =
    scheduleHooks.useCreateScheduleForm({
      defaultName: t('defaultScheduleName'),
      onSuccess: () => {
        toast.success(t('addSuccess'));
        router.replace(workingHoursPath);
      },
      onError: (error) => {
        const errorCode = error.errorCode;
        if (SCHEDULE_ERRORS.includes(errorCode)) {
          const errors = error.errors;
          const ids = errors?.map((e) => e.value);
          setConflictIds(ids || []);
          setOpenConflictDialog(true);
          return;
        }
        toast.error(t('addError'));
      },
    });

  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: 'workingHours',
  });

  const { mastersOptions, optionsPool, setSearchTerm, isLoading } =
    masterHooks.useMasterQueryWithOptions();

  const scheduleType = watch('patternType');

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

  const hasChanges = isDirty && Object.keys(touchedFields).length > 0;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleCancel = () => {
    if (hasChanges) {
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
                    label={t('name')}
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
                    label={t('type')}
                    required
                    options={SCHEDULE_OPTIONS.map((option) => ({
                      value: option.value,
                      label: t(`scheduleTypes.${option.value}`),
                    }))}
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
                  <FormSearchAutocomplete
                    label={t('applyTo')}
                    placeholder={t('searchMasters')}
                    error={errors.masterIds?.message}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    options={mastersOptions}
                    optionsPool={optionsPool}
                    onSearchChange={setSearchTerm}
                    loading={isLoading}
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
                    label={t('startDate')}
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
                    label={t('endDate')}
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
            <p className='mb-8 font-medium'>
              {t('schedule')} - {t(`scheduleTypes.${scheduleType}`)}
            </p>
            <div className='flex flex-col gap-4'>
              {fields.map((field, index) => (
                <CreateWorkingDayRow
                  key={field.id}
                  index={index}
                  control={control}
                  scheduleType={scheduleType}
                  setValue={setValue}
                  onRemoveDay={() => remove(index)}
                  disabledRemove={index === 0 && fields.length === 1}
                />
              ))}
              {scheduleType === 'custom' && (
                <Button variant='outlined' sx={{ mt: 2 }} onClick={appendDay}>
                  {t('addDay')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
      <section id='create-new-schedule-controls'>
        <div className='w-full flex gap-8 justify-end p-8'>
          <Button color='secondary' variant='outlined' onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button
            form='create-new-schedule'
            type='submit'
            color='secondary'
            variant='contained'
            disabled={!isValid}
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
      <ConflictScheduleDialog
        conflictIds={conflictIds}
        newScheduleData={{
          newScheduleName: watch('name'),
          startAt: watch('startAt'),
        }}
        open={!!openConflictDialog}
        onClose={() => {
          setOpenConflictDialog(false);
          setConflictIds([]);
        }}
        handleConfirm={handleSubmit}
        onCurrentStartDateUpdate={(newStartDate) => setValue('startAt', newStartDate)}
        onCurrentEndDateUpdate={(newEndDate) => setValue('endAt', newEndDate)}
      />
    </>
  );
};
