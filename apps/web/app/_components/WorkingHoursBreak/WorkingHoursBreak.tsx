import { FormTimeSelect } from '@/_components/FormTimeSelect/FormTimeSelect';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  showType?: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
  error?: string | boolean;
  initialStartTimeMinutes?: number;
  initialEndTimeMinutes?: number;
  registerStartTimeProps?: UseFormRegisterReturn;
  registerEndTimeProps?: UseFormRegisterReturn;
};

export const WorkingHoursBreak = (props: Props) => {
  const {
    name,
    label,
    options,
    disabled,
    error,
    initialStartTimeMinutes = 900,
    initialEndTimeMinutes = 960,
    registerStartTimeProps,
    registerEndTimeProps,
  } = props;

  const [startTimeMinutes, setStartTimeMinutes] = useState(initialStartTimeMinutes);
  const [endTimeMinutes, setEndTimeMinutes] = useState(initialEndTimeMinutes);

  const handleChangeStartTime = (value: string) => {
    setStartTimeMinutes(Number(value));
  };

  const handleChangeEndTime = (value: string) => {
    setEndTimeMinutes(Number(value));
  };

  return (
    <>
      <Typography variant='body2' color='secondary'>
        Break
      </Typography>
      <FormTimeSelect
        value={String(startTimeMinutes)}
        name='breakStartTime'
        disabled={disabled}
        options={options}
        onChange={handleChangeStartTime}
        registerProps={registerStartTimeProps}
      />
      <FormTimeSelect
        value={String(endTimeMinutes)}
        name='breakEndTime'
        disabled={disabled}
        options={options}
        onChange={handleChangeEndTime}
        registerProps={registerEndTimeProps}
      />
    </>
  );
};
