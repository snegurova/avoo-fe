import React from 'react';
import { InputHTMLAttributes } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { MobileDatePicker, StaticDatePicker } from '@mui/x-date-pickers';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  name: string;
  label?: string;
  value: dayjs.Dayjs | null;
  defaultValue?: string;
  disabled?: boolean;
  error?: string | null;
  onChange?: (value: string) => void;
};

export const DateTimeSelect = (props: Props) => {
  const { name, label, value, defaultValue, disabled, error = null, onChange, ...rest } = props;
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value ?? (defaultValue ? dayjs(defaultValue) : null)}
          format='MMMM D, YYYY'
          onChange={onChange}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small',
            },
          }}
          sx={{ pb: 1, pt: 1 }}
        />
      </LocalizationProvider>
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </>
  );
};
