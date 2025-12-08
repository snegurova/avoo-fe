'use client';

import { masterHooks, scheduleHooks } from '@avoo/hooks';
import { Modal } from '../Modal/Modal';
import FormInput from '../FormInput/FormInput';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { DateTimeSelect } from '../DateTimeSelect/DateTimeSelect';
import { WorkingHoursDaySettings } from '../WorkingHoursDaySettings/WorkingHoursDaySettings';
import { useState } from 'react';
import { useApiStatusStore } from '@avoo/store';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ScheduleAddModal = (props: Props) => {
  const { isOpen, onClose } = props;
  const isPending = useApiStatusStore((state) => state.isPending);

  const [selectedMasters, setSelectedMasters] = useState<string[]>([]);

  const { control, register, handleSubmit, errors } = scheduleHooks.useCreateScheduleForm({
    onSuccess: () => {
      console.log('Schedule updated successfully');
    },
  });

  const TYPE_OF_SCHEDULE = {
    weekly: { name: 'Weekly', pattern: 7, workingDaysCount: 5 },
    '2x2': { name: '2 on / 2 off', pattern: 4, workingDaysCount: 2 },
    '3x2': { name: '3 on / 2 off', pattern: 5, workingDaysCount: 3 },
    '2x1': { name: '2 on / 1 off', pattern: 3, workingDaysCount: 2 },
    custom: { name: 'Custom', pattern: 1, workingDaysCount: 1 },
  } as const;

  type ScheduleKey = keyof typeof TYPE_OF_SCHEDULE;

  const scheduleOptions = (Object.keys(TYPE_OF_SCHEDULE) as ScheduleKey[]).map((key) => ({
    label: TYPE_OF_SCHEDULE[key].name,
    value: key,
  }));

  const DEFAULT_WORKING_HOURS = {
    startTimeMinutes: 540,
    endTimeMinutes: 1080,
  };
  const DEFAULT_WORKING_HOURS_BREAKS = [
    {
      breakStartTimeMinutes: 780,
      breakEndTimeMinutes: 840,
    },
  ];
  const [selectedType, setSelectedType] = useState<ScheduleKey>('weekly');
  const mastersInfo = masterHooks.useGetMastersProfileInfo();
  const mastersOptions =
    mastersInfo?.map((master) => ({
      label: master.name ?? 'Master #' + master.id,
      value: String(master.id),
    })) || [];

  const convertDateToStringDateFormat = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  const addDaysToDate = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const getNextMonday = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    const daysToAdd = (8 - day) % 7 || 7;
    result.setDate(result.getDate() + daysToAdd);
    return result;
  };

  const handleScheduleTypeChange = (value: string) => {
    const newType = value as ScheduleKey;
    setSelectedType(newType);
  };

  // const { fields, append, replace } = useFieldArray({
  //   name: 'workingHours',
  //   control,
  // });

  const handleSelectedMasters = (values: string[]) => {
    setSelectedMasters(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
        <FormInput
          {...register('name')}
          type='text'
          name='name'
          label='Name of schedule'
          placeholder='Name of schedule'
          autoComplete='false'
          error={errors.name?.message}
        />
        <FormSelect
          {...register('pattern')}
          label='Type of schedule'
          name='type'
          options={scheduleOptions}
          value={selectedType}
          onChange={handleScheduleTypeChange}
        />

        <FormMultiSelect
          {...register('mastersIds')}
          label='Apply to'
          name='mastersIds'
          options={mastersOptions}
          selected={selectedMasters}
          onChange={handleSelectedMasters}
        />
        <Controller
          name='startAt'
          control={control}
          render={({ field }) => (
            <DateTimeSelect
              name='startAt'
              label='Start date'
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString())}
              defaultValue={convertDateToStringDateFormat(getNextMonday(new Date()))}
              error={errors.startAt?.message}
            />
          )}
        />
        {/* 
        <DateTimeSelect
          name='startAt'
          label='Start date'
          defaultValue={convertDateToStringDateFormat(getNextMonday(new Date()))}
          error={errors.startAt?.message}
        /> */}
        {Array.from({ length: TYPE_OF_SCHEDULE[selectedType].pattern }).map((_, index) => (
          <WorkingHoursDaySettings
            key={`workingHoursDay-${index}-${selectedType}`}
            name='workingHours'
            day={index}
            showType={TYPE_OF_SCHEDULE[selectedType].pattern === 7 ? 'string' : 'number'}
            workingHour={DEFAULT_WORKING_HOURS}
            workingHoursBreaks={DEFAULT_WORKING_HOURS_BREAKS}
            disabled={index >= TYPE_OF_SCHEDULE[selectedType].workingDaysCount}
            register={register}
          />
        ))}
        <Controller
          name='endAt'
          control={control}
          render={({ field }) => (
            <DateTimeSelect
              name='endAt'
              label='End date'
              defaultValue={convertDateToStringDateFormat(
                addDaysToDate(new Date(), TYPE_OF_SCHEDULE[selectedType].pattern * 56),
              )}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString())}
              error={errors.endAt?.message}
            />
          )}
        />
        <div className='flex justify-between'>
          <Button
            onClick={onClose}
            loading={isPending}
            disabled={isPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Secondary}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isPending}
            disabled={isPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Primary}
          >
            Create schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};
