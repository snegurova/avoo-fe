'use client';
import React, { useCallback } from 'react';
import type { Dayjs } from 'dayjs';
import { VALUE_DATE_FORMAT } from '@/_constants/dateFormats';
import { Modal } from '../Modal/Modal';
import { Button, Checkbox } from '@mui/material';
import dayjs from 'dayjs';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import DateTimePickers from '../DateTimePickers/DateTimePickers';
import { useForm } from 'react-hook-form';
import { masterHooks } from '@avoo/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export enum TimeOffType {
  Personal = 'personal',
  Holiday = 'holiday',
  Vacation = 'vacation',
  Sick = 'sick',
  Other = 'other',
}

export const WHOLE_DAY = {
  Whole: 'whole',
  Partial: 'partial',
} as const;

export type WholeDay = (typeof WHOLE_DAY)[keyof typeof WHOLE_DAY];

type FormValues = {
  type: TimeOffType;
  staff: string[];
  wholeDay: WholeDay;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  note: string;
};

const TimeOffAddModal = ({ isOpen, onClose }: Props) => {
  const masters = masterHooks.useGetMastersProfileInfo()?.items;

  const timeOffTypeLabels: Record<TimeOffType, string> = {
    [TimeOffType.Personal]: 'Personal break',
    [TimeOffType.Holiday]: 'Holiday (Salon)',
    [TimeOffType.Vacation]: 'Vacation',
    [TimeOffType.Sick]: 'Sick Leave',
    [TimeOffType.Other]: 'Other',
  };

  const timeOffTypeOptions = (Object.values(TimeOffType) as TimeOffType[]).map((value) => ({
    label: timeOffTypeLabels[value],
    value,
  }));

  const mastersOptions = [
    { label: 'All Staff', value: 'all' },
    ...(masters?.items.map((master) => ({
      label: master.name ?? `Master #${master.id}`,
      value: String(master.id),
    })) ?? []),
  ];

  const handleSubmitForm = (values: FormValues): void => {
    alert(JSON.stringify(values, null, 2));
    onClose();
  };

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      type: TimeOffType.Personal,
      staff: ['all'],
      wholeDay: WHOLE_DAY.Whole,
      startDate: dayjs().format(VALUE_DATE_FORMAT),
      startTime: '09:00',
      endDate: dayjs().format(VALUE_DATE_FORMAT),
      endTime: '18:00',
      note: '',
    },
  });

  const values = watch();

  const handleTypeChange = useCallback(
    (v: string) => {
      setValue('type', v as TimeOffType);
    },
    [setValue],
  );

  const handleStaffChange = useCallback(
    (vals: string[]) => {
      setValue('staff', vals);
    },
    [setValue],
  );

  const handleWholeDayChange = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
      setValue('wholeDay', checked ? WHOLE_DAY.Whole : WHOLE_DAY.Partial),
    [setValue],
  );

  const handleStartDateChange = useCallback(
    (newDate: Dayjs | null) => {
      setValue('startDate', newDate ? newDate.format('YYYY-MM-DD') : '');
    },
    [setValue],
  );

  const handleEndDateChange = useCallback(
    (newDate: Dayjs | null) => {
      setValue('endDate', newDate ? newDate.format('YYYY-MM-DD') : '');
    },
    [setValue],
  );

  const handleStartTimeChange = useCallback(
    (newTime: Dayjs | null) => {
      setValue('startTime', newTime ? newTime.format('HH:mm') : '');
    },
    [setValue],
  );

  const handleEndTimeChange = useCallback(
    (newTime: Dayjs | null) => {
      setValue('endTime', newTime ? newTime.format('HH:mm') : '');
    },
    [setValue],
  );

  const handleNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue('note', e.target.value),
    [setValue],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='relative min-h-[80vh]'>
        <div className='flex items-center justify-center py-4'>
          <h3 className='text-lg font-semibold'>Add Time off</h3>
        </div>
        <form onSubmit={handleSubmit(handleSubmitForm)} className='space-y-6 p-2'>
          <div>
            <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
              Type of Time off
            </label>
            <FormSelect
              id='type'
              name='type'
              options={timeOffTypeOptions}
              value={values.type}
              onChange={handleTypeChange}
            />
          </div>

          <div>
            <label htmlFor='staff' className='block text-sm font-medium text-gray-700'>
              Select Staff (For Salon)
            </label>
            <FormMultiSelect
              id='staff'
              name='staff'
              options={mastersOptions}
              selected={values.staff}
              onChange={handleStaffChange}
            />
          </div>

          <div>
            <div className='flex justify-between items-center'>
              <div>
                <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
                  Start Date
                </label>
              </div>
              <label className='inline-flex items-center gap-2'>
                <Checkbox
                  size='small'
                  checked={values.wholeDay === WHOLE_DAY.Whole}
                  onChange={handleWholeDayChange}
                  slotProps={{ input: { 'aria-label': 'whole day' } }}
                />
                <span className='text-sm'>Whole day</span>
              </label>
            </div>

            <DateTimePickers
              dateValue={values.startDate}
              timeValue={values.startTime}
              wholeDay={values.wholeDay === WHOLE_DAY.Whole}
              onDateChange={handleStartDateChange}
              onTimeChange={handleStartTimeChange}
              timeLabel='Start'
            />
          </div>

          <div>
            <label htmlFor='endDate' className='block text-sm font-medium text-gray-700'>
              End Date
            </label>
            <DateTimePickers
              dateValue={values.endDate}
              timeValue={values.endTime}
              wholeDay={values.wholeDay === WHOLE_DAY.Whole}
              onDateChange={handleEndDateChange}
              onTimeChange={handleEndTimeChange}
              timeLabel='End'
            />
          </div>
          <div>
            <label htmlFor='note' className='block text-sm font-medium text-gray-700'>
              Note
            </label>
            <textarea
              id='note'
              name='note'
              value={values.note}
              onChange={handleNoteChange}
              className='mt-3 block w-full border border-gray-200 p-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-800 sm:text-sm mb-[30px] h-[50px] resize-none'
              rows={1}
            />
          </div>

          <div className='flex justify-between'>
            <Button onClick={onClose} color='secondary' variant='outlined' sx={{ minWidth: 150 }}>
              Cancel
            </Button>
            <Button type='submit' color='secondary' variant='contained' sx={{ minWidth: 150 }}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TimeOffAddModal;
