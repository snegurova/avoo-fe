'use client';

import { masterHooks, scheduleHooks } from '@avoo/hooks';
import { Modal } from '../Modal/Modal';
import FormInput from '../FormInput/FormInput';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { routes } from '@/_routes/routes';
import { useRouter } from 'next/navigation';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormMultiSelect } from '../FormMultiSelect/FormMultiSelect';
import { DateTimeSelect } from '../DateTimeSelect/DateTimeSelect';
import { WorkingHoursDaySettings } from '../WorkingHoursDaySettings/WorkingHoursDaySettings';
type Props = {
  scheduleId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export const ScheduleEditModal = (props: Props) => {
  const router = useRouter();
  const { scheduleId, isOpen, onClose } = props;
  if (!scheduleId) return null;

  const schedule = scheduleHooks.useGetScheduleById(scheduleId);

  const { register, handleSubmit, errors } = scheduleHooks.useUpdateScheduleForm({
    onSuccess: () => {
      router.push(routes.WorkingHours);
    },
  });
  const TYPE_OF_SCHEDULE = [
    { label: 'Weekly', value: 7 },
    { label: '2 on / 2 off', value: 4 },
    { label: '3 on / 2 off', value: 5 },
    { label: '2 on / 1 off', value: 3 },
    { label: 'Custom', value: 1 },
  ];
  const mastersInfo = masterHooks.useGetMastersProfileInfo();
  const mastersOptions =
    mastersInfo?.map((master) => ({
      label: master.name ?? 'Master #' + master.id,
      value: master.id,
    })) || [];

  const selectedMasters = schedule?.master?.id
    ? [schedule.master.id]
    : mastersOptions.map((m) => m.value);

  const convertDateToStringDateFormat = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  return schedule ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
        <FormInput
          {...register('name')}
          type='text'
          name='name'
          label='Name of schedule'
          placeholder='Name of schedule'
          autoComplete='false'
          error={errors.name?.message}
          defaultValue={schedule.name}
        />
        <FormSelect
          label='Type of schedule'
          id={schedule.id.toString()}
          name='type'
          options={TYPE_OF_SCHEDULE}
          defaultValue={schedule.pattern}
        />

        <FormMultiSelect
          label='Apply to'
          name='mastersIds'
          options={mastersOptions}
          selected={selectedMasters}
        />
        <DateTimeSelect
          name='startDate'
          label='Start date'
          defaultValue={convertDateToStringDateFormat(new Date(schedule.startAt))}
        />
        {schedule.workingHours.map((workingHour, index) => (
          <WorkingHoursDaySettings key={index} name='workingHours' workingHour={workingHour} />
        ))}
        <DateTimeSelect
          name='endDate'
          label='End date'
          defaultValue={convertDateToStringDateFormat(new Date(schedule.endAt || new Date()))}
        />
        {/* <DateTimeSelect /> */}
        <div className='flex justify-between'>
          <Button
            onClick={onClose}
            loading={false}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Secondary}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={true}
            loading={false}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Primary}
          >
            Update schedule
          </Button>
        </div>
      </form>
    </Modal>
  ) : (
    <div>Not found by id: {scheduleId}</div>
  );
};
