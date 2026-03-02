import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

import { Button, FormControl, FormHelperText, TextField } from '@mui/material';
import dayjs from 'dayjs';

import { ScheduleEntity } from '@avoo/axios/types/apiTypes';
import { DEFAULT_SCHEDULE, SCHEDULE_OPTIONS } from '@avoo/constants/src/calendar';
import { scheduleHooks } from '@avoo/hooks';

import DisabledFormField from '@/_components/DisabledFormField/DisabledFormField';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import { UpdateWorkingDayRow } from '@/_components/ScheduleUpdateForm/UpdateWorkingDayRow';
import { DATE_PICKER_FORMAT, VALUE_DATE_FORMAT } from '@/_constants/dateFormats';
import { useToast } from '@/_hooks/useToast';
import { getAllErrorMessages } from '@/_utils/formError';

type Props = {
  schedule: ScheduleEntity;
  onCancel: () => void;
};

export default function ScheduleUpdateForm(props: Props) {
  const { schedule, onCancel } = props;
  const toast = useToast();

  const { control, setValue, handleSubmit, errors } = scheduleHooks.useUpdateScheduleForm({
    defaultValues: schedule,
    onSuccess: () => {
      toast.success('Schedule has been updated!');
      onCancel();
    },
    onError: (error) => {
      toast.error('Failed to update schedule  : ' + error.message);
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'workingHours',
  });

  const scheduleType =
    SCHEDULE_OPTIONS.find((option) => option.pattern === schedule.pattern) ?? DEFAULT_SCHEDULE;

  const errorsList = getAllErrorMessages(errors);

  return (
    <>
      <form
        id='update-service'
        className='mt-8 lg:mt-0 flex flex-col gap-4'
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
              <TextField {...field} required fullWidth value={field.value ?? ''} label='Name' />
            )}
          />
          {errors.name?.message && <FormHelperText>{errors.name?.message}</FormHelperText>}
        </FormControl>
        <DisabledFormField
          value={scheduleType?.label ?? ''}
          label='Type of schedule'
          required
          fullWidth
        />
        <DisabledFormField
          value={schedule.master ? schedule.master.name : 'All masters'}
          label='Applies to'
          required
          fullWidth
        />
        <DisabledFormField
          value={dayjs(schedule.startAt).format(DATE_PICKER_FORMAT)}
          label='Start date'
          required
          fullWidth
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
        {fields.map((wh, index) => (
          <UpdateWorkingDayRow
            key={wh.id}
            index={index}
            control={control}
            scheduleType={scheduleType.value}
            setValue={setValue}
          />
        ))}
      </form>
      <div className='sticky bottom-0 z-20 pt-4 bg-white flex items-center justify-end gap-4'>
        <Button color='secondary' variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <Button form='update-service' type='submit' color='secondary' variant='contained'>
          Edit
        </Button>
      </div>
    </>
  );
}
