import React, { useEffect } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  masterHooks,
  scheduleHooks,
  ScheduleKey,
  START_MINUTE,
  END_MINUTE,
  BREAK_START_MINUTES,
  BREAK_END_MINUTES,
  TYPE_OF_SCHEDULE,
  getNextMonday,
  toLocalDateISO,
} from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';
import { Modal } from '../Modal/Modal';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { DateSelect } from '../DateSelect/DateSelect';
import FormInput from '../FormInput/FormInput';
import { getAllErrorMessages } from '@/_utils/formError';
import { WorkingDayRow } from '../WorkingDayRow/WorkingDayRow';

import { Button } from '@mui/material';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ScheduleAddModal = (props: Props) => {
  const { isOpen, onClose } = props;
  const isPending = useApiStatusStore((state) => state.isPending);

  const { control, register, handleSubmit, setValue, watch, errors } =
    scheduleHooks.useCreateScheduleForm({
      onSuccess: () => {
        alert('Schedule added successfully');
      },
      onError: () => {
        alert('Schedule add failed');
      },
    });

  const { fields, replace } = useFieldArray({
    control,
    name: 'workingHours',
  });

  const masters = masterHooks.useGetMastersProfileInfo();

  const scheduleType = watch('patternType') as ScheduleKey;
  const scheduleOptions = scheduleHooks.useScheduleOptions();
  const mastersOptions =
    masters?.map((m) => ({
      label: m.name ?? `Master #${m.id}`,
      value: m.id.toString(),
    })) ?? [];

  useEffect(() => {
    if (!scheduleType) return;

    const config = TYPE_OF_SCHEDULE[scheduleType];
    setValue('pattern', config.pattern);
    const newDays = Array.from({ length: config.pattern }).map((_, index) => ({
      day: index + 1,
      enabled: index < config.workingDaysCount,
      startTimeMinutes: index < config.workingDaysCount ? START_MINUTE : 0,
      endTimeMinutes: index < config.workingDaysCount ? END_MINUTE : 0,
      breaks:
        index < config.workingDaysCount
          ? [
              {
                breakStartTimeMinutes: BREAK_START_MINUTES,
                breakEndTimeMinutes: BREAK_END_MINUTES,
              },
            ]
          : [],
    }));

    replace(newDays);
  }, [scheduleType]);

  const errorsList = getAllErrorMessages(errors);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <FormInput {...register('name')} label='Name' />

        <Controller
          name='patternType'
          control={control}
          defaultValue='weekly'
          render={({ field }) => (
            <FormSelect
              name='patternType'
              label='Type'
              options={scheduleOptions}
              value={field.value}
              onChange={(v) => {
                const key = v as ScheduleKey;
                field.onChange(key);
                const numericPattern = TYPE_OF_SCHEDULE[key].pattern;
                setValue('pattern', numericPattern);
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
          defaultValue={toLocalDateISO(getNextMonday(new Date()))}
          render={({ field }) => (
            <DateSelect
              name='startAt'
              label='Start date'
              value={dayjs(field.value)}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
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

        <div className='flex justify-between mt-2'>
          <Button onClick={onClose} loading={isPending} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button loading={isPending} onClick={handleSubmit} color='secondary' variant='contained'>
            Create
          </Button>
        </div>
        {errorsList.length > 0 && (
          <div className='text-red-600 text-sm space-y-1'>
            {errorsList.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}
      </form>
    </Modal>
  );
};
