import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { FormTimeSelect } from '../FormTimeSelect/FormTimeSelect';
import { Checkbox } from '@mui/material';
import { IconButton } from '../IconButton/IconButton';
import { WorkingHoursBreak } from '@/_components/WorkingHoursBreak/WorkingHoursBreak';
import type { UseFormRegister } from 'react-hook-form';
import { ScheduleCreateFormData } from '@avoo/hooks/schemas/schedulesValidationSchemas';

type Props = {
  name: string;
  label?: string;
  day: number;
  showType?: string;
  workingHour: {
    startTimeMinutes: number;
    endTimeMinutes: number;
    id?: number;
  };
  workingHoursBreaks: {
    breakStartTimeMinutes: number;
    breakEndTimeMinutes: number;
    id?: number;
  }[];
  disabled?: boolean;
  error?: string | boolean;
  register: UseFormRegister<ScheduleCreateFormData>;
};

export const WorkingHoursDaySettings = (props: Props) => {
  const {
    name,
    label,
    day,
    showType = 'string',
    workingHour,
    workingHoursBreaks,
    disabled,
    error,
    register,
  } = props;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const isWorkingHoursEnabled =
    workingHour.startTimeMinutes !== 0 || workingHour.endTimeMinutes !== 0;
  const [isChecked, setIsChecked] = useState(disabled ? false : isWorkingHoursEnabled);
  const [breaks, setBreaks] = useState(workingHoursBreaks);

  const [startTimeMinutes, setStartTimeMinutes] = useState(workingHour.startTimeMinutes);
  const [endTimeMinutes, setEndTimeMinutes] = useState(workingHour.endTimeMinutes);

  const handleStartTimeChange = (value: string) => {
    setStartTimeMinutes(Number(value));
  };

  const handleEndTimeChange = (value: string) => {
    setEndTimeMinutes(Number(value));
  };

  useEffect(() => {
    if (!isChecked) {
      setEndTimeMinutes(0);
      setStartTimeMinutes(0);
      setBreaks([]);
      return;
    }
    setStartTimeMinutes(workingHour.startTimeMinutes);
    setEndTimeMinutes(workingHour.endTimeMinutes);
    setBreaks(workingHoursBreaks);
  }, [isChecked]);

  const workingHours = Array.from({ length: 48 }, (_, i) => ({
    label:
      i % 2 === 0
        ? `${Math.floor(i / 2)
            .toString()
            .padStart(2, '0')}:00`
        : `${Math.floor(i / 2)
            .toString()
            .padStart(2, '0')}:30`,
    value: String(i * 30),
  }));
  return (
    <>
      <div className='flex flex-row gap-1 mb-1'>
        <Checkbox
          value={isChecked}
          defaultChecked={disabled ? false : isWorkingHoursEnabled}
          onChange={() => setIsChecked(!isChecked)}
          sx={{
            color: '#E8DEEE',
            '&.Mui-checked': {
              color: '#BB94CE',
            },
          }}
        />
        <Typography variant='body2' sx={{ width: '100px', display: 'flex', alignItems: 'center' }}>
          {showType === 'string' ? dayNames[day] : `Day ${day + 1}`}
        </Typography>
        <FormTimeSelect
          value={String(startTimeMinutes)}
          name='startAt'
          disabled={!isChecked}
          options={workingHours}
          onChange={handleStartTimeChange}
          registerProps={register(`workingHours.${day}.startTimeMinutes`)}
        />
        <FormTimeSelect
          value={String(endTimeMinutes)}
          name='endAt'
          disabled={!isChecked}
          options={workingHours}
          onChange={handleEndTimeChange}
          registerProps={register(`workingHours.${day}.endTimeMinutes`)}
        />
        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
      {breaks.map((br, index) => (
        <div
          className='flex flex-row gap-1 justify-center items-center mb-px'
          key={br.id ? br.id : `${day}-${breaks.length + index}`}
        >
          <WorkingHoursBreak
            options={workingHours}
            key={br.id ? br.id : `${day}-${breaks.length + index}`}
            name='break'
            label='Break'
            initialStartTimeMinutes={br.breakStartTimeMinutes}
            initialEndTimeMinutes={br.breakEndTimeMinutes}
            disabled={!isChecked}
            error={error}
            registerStartTimeProps={register(
              `workingHours.${day}.breaks.${index}.breakStartTimeMinutes`,
            )}
            registerEndTimeProps={register(
              `workingHours.${day}.breaks.${index}.breakEndTimeMinutes`,
            )}
          />
          <IconButton
            icon='➖'
            ariaLabel='Remove break'
            type='button'
            onClick={() => setBreaks(breaks.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      {isChecked && (
        <div className='flex flex-row gap-1 justify-center items-center mb-px'>
          <IconButton
            icon='➕'
            ariaLabel='Add break'
            type='button'
            onClick={() =>
              setBreaks([
                ...breaks,
                {
                  breakStartTimeMinutes: 780,
                  breakEndTimeMinutes: 840,
                },
              ])
            }
          />
          <Typography variant='body2' color='secondary'>
            Add break
          </Typography>
        </div>
      )}
    </>
  );
};
