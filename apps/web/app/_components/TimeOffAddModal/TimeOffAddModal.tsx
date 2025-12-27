import React from 'react';
import { Modal } from '../Modal/Modal';
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import FormInput from '../FormInput/FormInput';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { Formik, Form, FormikProps } from 'formik';
import { masterHooks } from '@avoo/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
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

const TimeOffAddModal = ({ isOpen, onClose, onBack }: Props) => {
  const masters = masterHooks.useGetMastersProfileInfo();

  const timeOffTypeOptions = [
    { label: 'Personal breake', value: 'personal' },
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

  const handleSubmitFormik = (values: FormValues): void => {
    // TODO: integrate with Time Off API: conflict check -> show banner -> save
    // values contains: { type, staff, wholeDay, startDate, startTime, endDate, endTime, note }
    // For salon-wide time off, staff may contain ['all']
    // Implement API call here
    // For now show stub and close
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='relative'>
        <IconButton
          onClick={() => onBack?.()}
          sx={{ position: 'absolute', top: -25, left: -25, zIndex: 10 }}
          aria-label='back'
        >
          <ArrowBackIcon />
        </IconButton>

        <div className='flex items-center justify-center py-4'>
          <h3 className='text-lg font-semibold'>Add Time off</h3>
        </div>

        <Formik<FormValues>
          initialValues={{
            type: 'personal',
            staff: ['all'],
            wholeDay: true,
            startDate: '',
            startTime: '09:00',
            endDate: '',
            endTime: '18:00',
            note: '',
          }}
          onSubmit={handleSubmitFormik}
        >
          {({ values, setFieldValue }: FormikProps<FormValues>) => (
            <Form className='space-y-6 p-2'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Type of Time off</label>
                <FormSelect
                  name='type'
                  label='Type of Time off'
                  options={timeOffTypeOptions}
                  value={values.type}
                  onChange={(v) => setFieldValue('type', v)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Select Staff (For Salon)
                </label>
                <FormMultiSelect
                  name='staff'
                  label='Select Staff'
                  options={mastersOptions}
                  selected={values.staff}
                  onChange={(vals) => setFieldValue('staff', vals)}
                />
              </div>

              <div className='flex justify-between'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Start Date</label>
                </div>
                <label className='inline-flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={values.wholeDay}
                    onChange={(e) => setFieldValue('wholeDay', e.target.checked)}
                  />
                  <span className='text-sm'>Whole day</span>
                </label>
              </div>
              <FormInput
                type='date'
                name='startDate'
                value={values.startDate}
                onChange={(e) => setFieldValue('startDate', e.target.value)}
              />

              {!values.wholeDay && (
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Start time</label>
                  <FormInput
                    type='time'
                    name='startTime'
                    value={values.startTime}
                    onChange={(e) => setFieldValue('startTime', e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-gray-700'>End Date</label>
                <FormInput
                  type='date'
                  name='endDate'
                  value={values.endDate}
                  onChange={(e) => setFieldValue('endDate', e.target.value)}
                />
              </div>
              {!values.wholeDay && (
                <div>
                  <label className='block text-sm font-medium text-gray-700'>End time</label>
                  <FormInput
                    type='time'
                    name='endTime'
                    value={values.endTime}
                    onChange={(e) => setFieldValue('endTime', e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className='block text-sm font-medium text-gray-700'>Note</label>
                <textarea
                  name='note'
                  value={values.note}
                  onChange={(e) => setFieldValue('note', e.target.value)}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 sm:text-sm'
                  rows={4}
                />
              </div>

              <div className='flex justify-between'>
                <Button
                  onClick={onClose}
                  color='secondary'
                  variant='outlined'
                  sx={{ minWidth: 150 }}
                >
                  Cancel
                </Button>
                <Button type='submit' color='secondary' variant='contained' sx={{ minWidth: 150 }}>
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default TimeOffAddModal;
