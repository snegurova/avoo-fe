import React from 'react';
import { FormControl, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CalendarIcon from '@/_icons/CalendarIcon';
import { DATE_PICKER_FORMAT, DATE_TIME_FORMAT } from '@/_constants/dateFormats';

type Props = {
  label?: string;
  size?: 'small' | 'medium';
  date?: string | null;
  valueFormat?: string;
  required?: boolean;
  onChange: (newDate: string) => void;
  error?: string;
};

export default function FormDatePicker(props: Props) {
  const { label, date, required = false, onChange, error, valueFormat, size = 'small' } = props;

  const onValueChange = (newDate: dayjs.Dayjs | null) => {
    const convertedDate = newDate ? newDate.format(valueFormat || DATE_TIME_FORMAT) : '';
    onChange(convertedDate);
  };

  const isError = !!error;

  return (
    <FormControl size={size} fullWidth error={isError}>
      <DatePicker
        label={label}
        value={date ? dayjs(date) : null}
        format={DATE_PICKER_FORMAT}
        disablePast={true}
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
