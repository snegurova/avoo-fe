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
  onChange?: (value: string) => void;
};

export const DateSelect = (props: Props) => {
  const { name, label, value, defaultValue, error = null, onChange } = props;
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          name={name}
          label={label}
          value={value ?? (defaultValue ? dayjs(defaultValue) : null)}
          format='MMMM D, YYYY'
          onChange={(newValue) => onChange?.(newValue ? newValue.toISOString() : '')}
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
