'use client';

import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { useApiStatusStore } from '@avoo/store';
import { masterHooks, scheduleHooks } from '@avoo/hooks';
import { Modal } from '../Modal/Modal';
import FormInput from '../FormInput/FormInput';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { DateSelect } from '../DateSelect/DateSelect';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { convertToMidnightDate } from '@/_utils/date.utils';
import { getAllErrorMessages } from '@/_utils/formError.utils';

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

  const { register, errors, control } = scheduleHooks.useUpdateScheduleForm({
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
          <Controller
            name='mastersIds'
            control={control}
            render={({ field }) => (
              <FormMultiSelect
                name='mastersIds'
                label='Apply to'
                options={mastersOptions}
                selected={((field.value ?? []) as number[]).map((v) => v.toString())}
                onChange={(vals) => field.onChange(vals.map((v) => Number(v)))}
              />
            )}
          />
          <Controller
            name='endAt'
            control={control}
            render={({ field }) => (
              <DateSelect
                name='startAt'
                label='End date'
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) =>
                  field.onChange(date ? convertToMidnightDate(new Date(date)).toISOString() : null)
                }
              />
            )}
          />
          <div className='flex justify-between'>
            <Button
              onClick={onClose}
              loading={isPending}
              fit={ButtonFit.Inline}
              intent={ButtonIntent.Secondary}
            >
              Cancel
            </Button>
            <Button loading={isPending} fit={ButtonFit.Inline} intent={ButtonIntent.Primary}>
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
      ) : (
        <>Loading...</>
      )}
    </Modal>
  );
};
