import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

type Props = {
  name: string;
  label?: string;
  value: dayjs.Dayjs | null;
  defaultValue?: string;
  error?: string | null;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export const DateSelect = (props: Props) => {
  const { name, label, value, defaultValue, error = null, onChange, disabled = false } = props;
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          name={name}
          label={label}
          value={value ?? (defaultValue ? dayjs(defaultValue) : null)}
          format='MMMM D, YYYY'
          onChange={(newValue) => onChange?.(newValue ? newValue.format('YYYY-MM-DD') : '')}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small',
            },
          }}
          disabled={disabled}
        />
      </LocalizationProvider>
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </>
  );
};
