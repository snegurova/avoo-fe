'use client';
import React from 'react';
import { Modal } from '../Modal/Modal';
import { Button, Checkbox } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs from 'dayjs';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { useForm } from 'react-hook-form';
import { masterHooks } from '@avoo/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FormValues = {
  type: string;
  staff: string[];
  wholeDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  note: string;
};

const TimeOffAddModal = ({ isOpen, onClose }: Props) => {
  const masters = masterHooks.useGetMastersProfileInfo();

  const timeOffTypeOptions = [
    { label: 'Personal break', value: 'personal' },
    { label: 'Holiday (Salon)', value: 'holiday' },
    { label: 'Vacation', value: 'vacation' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Other', value: 'other' },
  ];

  const mastersOptions = [
    { label: 'All Staff', value: 'all' },
    ...(masters?.map((master) => ({
      label: master.name ?? `Master #${master.id}`,
      value: String(master.id),
    })) ?? []),
  ];

  const handleSubmitForm = (values: FormValues): void => {
    // TODO: integrate with Time Off API: conflict check -> show banner -> save
    // values contains: { type, staff(masters), wholeDay, startDate, startTime, endDate, endTime, note }
    // For salon-wide time off, staff may contain ['all']
    // Implement API call here
    // For now show stub and close
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    onClose();
  };

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      type: 'personal',
      staff: ['all'],
      wholeDay: true,
      startDate: dayjs().format('YYYY-MM-DD'),
      startTime: '09:00',
      endDate: dayjs().format('YYYY-MM-DD'),
      endTime: '18:00',
      note: '',
    },
  });

  const values = watch();

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
              onChange={(v) => setValue('type', v)}
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
              onChange={(vals) => setValue('staff', vals)}
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
                  checked={values.wholeDay}
                  onChange={(_e, checked) => setValue('wholeDay', checked)}
                  slotProps={{ input: { 'aria-label': 'whole day' } }}
                />
                <span className='text-sm'>Whole day</span>
              </label>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {values.wholeDay ? (
                <div className='mt-3'>
                  <DatePicker
                    format='ddd DD MMM YYYY'
                    value={values.startDate ? dayjs(values.startDate) : null}
                    onChange={(newDate) =>
                      setValue('startDate', newDate ? newDate.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </div>
              ) : (
                <div className='mt-3 flex flex-col gap-3'>
                  <DatePicker
                    format='ddd DD MMM YYYY'
                    value={values.startDate ? dayjs(values.startDate) : null}
                    onChange={(newDate) =>
                      setValue('startDate', newDate ? newDate.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <TimePicker
                    format='HH:mm'
                    value={values.startTime ? dayjs(values.startTime, 'HH:mm') : null}
                    onChange={(newTime) =>
                      setValue('startTime', newTime ? newTime.format('HH:mm') : '')
                    }
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <span className='text-sm text-gray-700'>Start</span>
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </div>
              )}
            </LocalizationProvider>
          </div>

          <div>
            <label htmlFor='endDate' className='block text-sm font-medium text-gray-700'>
              End Date
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {values.wholeDay ? (
                <div className='mt-3'>
                  <DatePicker
                    format='ddd DD MMM YYYY'
                    value={values.endDate ? dayjs(values.endDate) : null}
                    onChange={(newDate) =>
                      setValue('endDate', newDate ? newDate.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </div>
              ) : (
                <div className='mt-3 flex flex-col gap-3'>
                  <DatePicker
                    format='ddd DD MMM YYYY'
                    value={values.endDate ? dayjs(values.endDate) : null}
                    onChange={(newDate) =>
                      setValue('endDate', newDate ? newDate.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <TimePicker
                    format='HH:mm'
                    value={values.endTime ? dayjs(values.endTime, 'HH:mm') : null}
                    onChange={(newTime) =>
                      setValue('endTime', newTime ? newTime.format('HH:mm') : '')
                    }
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <span className='text-sm text-gray-700'>End</span>
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </div>
              )}
            </LocalizationProvider>
          </div>
          <div>
            <label htmlFor='note' className='block text-sm font-medium text-gray-700'>
              Note
            </label>
            <textarea
              id='note'
              name='note'
              value={values.note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setValue('note', e.target.value)
              }
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
