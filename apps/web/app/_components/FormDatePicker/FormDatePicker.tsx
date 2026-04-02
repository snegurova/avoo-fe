import React from 'react';

import { FormControl, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { DATE_PICKER_FORMAT, DATE_TIME_FORMAT } from '@avoo/constants';

import CalendarIcon from '@/_icons/CalendarIcon';

type Props = {
  label?: string;
  size?: 'small' | 'medium';
  date?: string | null;
  valueFormat?: string;
  disablePast?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange?: (newDate: string) => void;
  error?: string;
  format?: string;
};

export default function FormDatePicker(props: Props) {
  const {
    label,
    date,
    required = false,
    onChange,
    error,
    valueFormat,
    disablePast = true,
    size = 'small',
    format = DATE_PICKER_FORMAT,
    disabled = false,
  } = props;

  const onValueChange = (newDate: dayjs.Dayjs | null) => {
    const convertedDate = newDate ? newDate.format(valueFormat || DATE_TIME_FORMAT) : '';
    onChange?.(convertedDate);
  };

  const isError = !!error;

  return (
    <FormControl size={size} fullWidth error={isError}>
      <DatePicker
        label={label}
        value={date ? dayjs(date) : null}
        format={format}
        disablePast={disablePast}
        disabled={disabled}
        slots={{
          openPickerIcon: () => <CalendarIcon className='fill-black w-6 h-6' />,
        }}
        slotProps={{
          textField: {
            required,
            error: isError,
            sx: {
              '& span': {
                fontSize: 16,
              },
              '& .MuiPickersInputBase-root': {
                borderRadius: 1,
                minHeight: 44,
              },
            },
          },
        }}
        onChange={onValueChange}
      />
      {isError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
