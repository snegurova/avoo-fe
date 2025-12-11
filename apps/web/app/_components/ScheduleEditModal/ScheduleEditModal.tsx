'use client';

import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { useApiStatusStore } from '@avoo/store';
import { masterHooks, scheduleHooks } from '@avoo/hooks';
import { Modal } from '../Modal/Modal';
import FormInput from '../FormInput/FormInput';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { DateSelect } from '../DateSelect/DateSelect';
import { getAllErrorMessages } from '@/_utils/formError.utils';
import { Button } from '@mui/material';
import { WorkingDayRow } from '../WorkingDayRow/WorkingDayRow';

type Props = {
  scheduleId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export const ScheduleEditModal = (props: Props) => {
  const { scheduleId, isOpen, onClose } = props;
  if (!scheduleId) return null;
  const schedule = scheduleHooks.useGetScheduleById(scheduleId);
  const isPending = useApiStatusStore((state) => state.isPending);

  const { register, errors, control, watch, setValue } = scheduleHooks.useUpdateScheduleForm({
    onSuccess: () => {
      alert('Schedule updated successfully');
    },
  });

  const mastersInfo = masterHooks.useGetMastersProfileInfo();
  const mastersOptions =
    mastersInfo?.map((m) => ({
      label: m.name ?? `Master #${m.id}`,
      value: m.id.toString(),
    })) ?? [];
  mastersOptions.push({ label: 'All', value: 'all' });
  const errorsList = getAllErrorMessages(errors);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {schedule && !isPending ? (
        <form className='space-y-6'>
          <FormInput
            {...register('name')}
            className='border p-2 w-full'
            placeholder='Schedule name'
            label='Name'
            value={schedule.name}
          />

          <FormMultiSelect
            name='mastersIds'
            label='Apply to'
            options={mastersOptions}
            selected={[schedule.master ? schedule.master.id.toString() : 'all']}
            disabled
          />

          <DateSelect name='startAt' label='Start at' value={dayjs(schedule.startAt)} disabled />

          {/* {fields.map((field, index) => (
                    <WorkingDayRow
                      key={field.id}
                      index={index}
                      control={control}
                      watch={watch}
                      scheduleType={scheduleType}
                      setValue={setValue}
                    />
                  ))} */}

          {schedule.workingHours.map((day, index) => (
            <WorkingDayRow
              key={day.id}
              index={index}
              control={control}
              watch={watch}
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
            <Button loading={isPending} color='secondary' variant='contained'>
              Update
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
      ) : (
        <>Loading...</>
      )}
    </Modal>
  );
};
