import { FormSelect } from '../FormSelect/FormSelect';
import React from 'react';

interface WorkingHoursSettingsProps {
  name: string;
  label?: string;
  workingHour: { startTimeMinutes: number; endTimeMinutes: number; id?: number };
  disabled?: boolean;
  error?: string | boolean;
  onChange?: (value: string) => void;
}

export const WorkingHoursDaySettings = ({
  name,
  label,
  workingHour,
  disabled,
  error,
  onChange,
}: WorkingHoursSettingsProps) => {
  const workingHours = Array.from({ length: 48 }, (_, i) => ({
    label:
      i % 2 === 0
        ? `${Math.floor(i / 2)
            .toString()
            .padStart(2, '0')}:00`
        : `${Math.floor(i / 2)
            .toString()
            .padStart(2, '0')}:30`,
    value: i * 30,
  }));
  const isWorkingHoursEnabled =
    workingHour.startTimeMinutes !== 0 || workingHour.endTimeMinutes !== 0;
  const [isChecked, setIsChecked] = React.useState(isWorkingHoursEnabled);
  return (
    <div className='flex flex-row gap-1'>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <FormSelect
        label={label}
        name={`${name}-start-time-minutes`}
        options={workingHours}
        defaultValue={workingHour.startTimeMinutes}
        disabled={disabled}
        error={error}
        onChange={onChange}
      />

      <FormSelect
        label={label}
        name={`${name}-end-time-minutes`}
        options={workingHours}
        defaultValue={workingHour.endTimeMinutes}
        disabled={disabled}
        error={error}
        onChange={onChange}
      />
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
};
