'use client';

import React, { useCallback, useEffect } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { VALUE_DATE_FORMAT } from '@/_constants/dateFormats';
import { Switch, FormControlLabel } from '@mui/material';
import FormTextarea from '../FormTextArea/FormTextArea';
import { timeUtils, validateEndDateFactory } from '@avoo/shared';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import DateTimePickers, { DateTimePickersVariant } from '../DateTimePickers/DateTimePickers';
import ModeToggle from '../ModeToggle/ModeToggle';
import { useController, Controller, useForm } from 'react-hook-form';
import { masterHooks, exceptionHooks, timeToMinutes } from '@avoo/hooks';
import { useToast } from '@/_hooks/useToast';
import { getSyncedEndDate } from '@/_utils/timeOffDateSync';
import DeleteIcon from '@/_icons/DeleteIcon';
import { IconButton } from '@/_components/IconButton/IconButton';
import ModalActions from '../ModalActions/ModalActions';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import {
  TimeOffMode,
  TimeOffType,
  timeOffTypes,
  timeOffTypeLabels,
  WholeDay,
} from '@avoo/hooks/types/timeOffType';
import type { TimeOffItem } from '../TimeOffEditModal/TimeOffEditModal';

type FormValues = {
  type: TimeOffType;
  mode: TimeOffMode;
  staff: string[];
  wholeDay: WholeDay;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  note: string;
};

const MINUTES_IN_DAY = 24 * 60;

const mapTimeOffToFormValues = (timeOff: TimeOffItem): FormValues => {
  const isWorkingType = timeOff.type.includes('WORKING');
  const typeMapping =
    timeOffTypes.find((t) => t.api === timeOff.type)?.value || TimeOffType.Personal;
  const isWholeDay = timeOff.startTimeMinutes === 0 && timeOff.endTimeMinutes === MINUTES_IN_DAY;
  const selectedStaff = timeOff.masterId ? [String(timeOff.masterId)] : ['all'];

  return {
    type: typeMapping,
    mode: isWorkingType ? TimeOffMode.ExtraTime : TimeOffMode.TimeOff,
    staff: selectedStaff,
    wholeDay: isWholeDay ? WholeDay.Whole : WholeDay.Partial,
    startDate: dayjs(timeOff.dateFrom).format(VALUE_DATE_FORMAT),
    startTime: timeUtils.getTimeFromMinutes(timeOff.startTimeMinutes),
    endDate: dayjs(timeOff.dateTo).format(VALUE_DATE_FORMAT),
    endTime: timeUtils.getTimeFromMinutes(timeOff.endTimeMinutes),
    note: timeOff.note || '',
  };
};

type Props = {
  timeOff: TimeOffItem;
  onClose: () => void;
  onRequestClose?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

export default function TimeOffEditForm({
  timeOff,
  onClose,
  onRequestClose,
  onDirtyChange,
}: Readonly<Props>) {
  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const toast = useToast();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const mastersOptions = [
    { label: 'All Staff', value: 'all' },
    ...(masters?.map((master) => ({
      label: master.name ?? `Master #${master.id}`,
      value: String(master.id),
    })) ?? []),
  ];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty: hasChanges },
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      type: TimeOffType.Personal,
      mode: TimeOffMode.TimeOff,
      staff: [],
      wholeDay: WholeDay.Whole,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      note: '',
    },
  });

  const { updateException, isPending: isUpdatePending } = exceptionHooks.useUpdateException(() => {
    toast.success('Time off updated successfully');
    onClose();
  });

  const { mutate: deleteException, isPending: isDeletePending } = exceptionHooks.useDeleteException(
    () => {
      toast.info('Time off was deleted!');
      setIsDeleteConfirmOpen(false);
      onClose();
    },
  );

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);

  useEffect(() => {
    reset(mapTimeOffToFormValues(timeOff));
  }, [timeOff, reset]);

  const values = watch();

  const timeOffTypeOptions = React.useMemo(
    () =>
      timeOffTypes.map(({ value }) => ({
        label: timeOffTypeLabels[value],
        value,
      })),
    [],
  );

  const headerLabel = React.useMemo(() => {
    if (values.mode === TimeOffMode.TimeOff) {
      return timeOffTypeOptions.find((option) => option.value === values.type)?.label ?? 'Time off';
    }
    return 'Working time';
  }, [values.mode, values.type, timeOffTypeOptions]);

  const handleStartTimeChange = useCallback(
    (newTime: Dayjs | null) => {
      setValue('startTime', newTime ? newTime.format('HH:mm') : '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handleEndTimeChange = useCallback(
    (newTime: Dayjs | null) =>
      setValue('endTime', newTime ? newTime.format('HH:mm') : '', {
        shouldDirty: true,
        shouldValidate: true,
      }),
    [setValue],
  );

  const handleStartDateChange = useCallback(
    (newDate: Dayjs | null) => {
      const nextStartDate = newDate ? newDate.format(VALUE_DATE_FORMAT) : '';
      setValue('startDate', nextStartDate, {
        shouldDirty: true,
        shouldValidate: true,
      });

      const syncedEndDate = getSyncedEndDate(nextStartDate, getValues('endDate'));
      if (syncedEndDate) {
        setValue('endDate', syncedEndDate, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [setValue, getValues],
  );

  const handleEndDateChange = useCallback(
    (newDate: Dayjs | null) =>
      setValue('endDate', newDate ? newDate.format(VALUE_DATE_FORMAT) : '', {
        shouldDirty: true,
        shouldValidate: true,
      }),
    [setValue],
  );

  const handleModeChange = useCallback(
    (mode: TimeOffMode) => {
      setValue('mode', mode, { shouldDirty: true, shouldValidate: true });
    },
    [setValue],
  );

  const handleCancel = useCallback(() => {
    (onRequestClose ?? onClose)();
  }, [onRequestClose, onClose]);

  const { field: noteField } = useController({ name: 'note', control });

  const onSubmit = (data: FormValues) => {
    const typeApi = timeOffTypes.find((type) => type.value === data.type)?.api || 'PERSONAL_OFF';

    updateException(timeOff.id, {
      type: typeApi,
      dateFrom: data.startDate,
      dateTo: data.endDate,
      startTimeMinutes: timeToMinutes(data.startTime),
      endTimeMinutes: timeToMinutes(data.endTime),
      masterIds: data.staff.includes('all') ? [] : data.staff.map((id) => Number.parseInt(id, 10)),
      note: data.note || undefined,
    });
  };

  const handleDeleteClick = useCallback(() => {
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteException(timeOff.id);
  }, [deleteException, timeOff.id]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex-1 flex flex-col gap-6 md:gap-8 min-h-0'
      >
        <div className='flex-1 max-w-4xl space-y-6 md:space-y-8'>
          <div className='flex justify-between'>
            <h2 className='text-2xl'>Schedule exception</h2>
            <div>
              <IconButton
                ariaLabel='Delete'
                icon={<DeleteIcon className='fill-current' />}
                onClick={handleDeleteClick}
                className='inline-flex items-center justify-center bg-primary-50 p-2.5 rounded-[8px] hover:bg-red-100 focus:bg-red-100 hover:text-red-900 focus:text-red-900 transition-colors'
              />
            </div>
          </div>

          <ModeToggle value={values.mode} onChange={handleModeChange} />

          <div className='flex flex-col gap-6 border border-gray-200 rounded-lg p-4'>
            {values.mode === TimeOffMode.TimeOff && (
              <div>
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

            <div>
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
              <div>
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
                        variant={DateTimePickersVariant.Modal}
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

              <div>
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
                        variant={DateTimePickersVariant.Modal}
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
        </div>

        <ModalActions
          onCancel={handleCancel}
          submitType='submit'
          loading={isUpdatePending}
          submitDisabled={!hasChanges}
        />
      </form>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete time off'
        description='Are you sure you want to permanently delete this schedule exception? This action cannot be undone.'
        confirmText='Delete time off'
        submitDisabled={isDeletePending}
      />
    </>
  );
}
