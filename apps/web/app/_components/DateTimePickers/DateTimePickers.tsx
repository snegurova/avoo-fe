'use client';
import React from 'react';
import type { Dayjs } from 'dayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT, TIME_FORMAT } from '@/_constants/dateFormats';

type Props = Readonly<{
  dateValue?: string;
  timeValue?: string;
  wholeDay: boolean;
  onDateChange: (d: Dayjs | null) => void;
  onTimeChange?: (t: Dayjs | null) => void;
}>;

export default function DateTimePickers({
  dateValue,
  timeValue,
  wholeDay,
  onDateChange,
  onTimeChange,
}: Props) {
  const transition = 'flex-basis 300ms ease, width 300ms ease, opacity 300ms ease';

  const dateSx = {
    '& .MuiPickersInputBase-root': { borderRadius: 1, height: 44 },
    minWidth: 0,
    transition,
    flex: wholeDay ? { xs: '1 1 100%', md: '1 1 0' } : { xs: '0 0 65%', md: '1 1 0' },
    width: wholeDay ? { xs: '100%', md: 'auto' } : { xs: '65%', md: 'auto' },
  };

  const timeSx = {
    '& .MuiPickersInputBase-root': { borderRadius: 1, height: 44 },
    minWidth: 0,
    transition,
    flex: wholeDay ? { xs: '0 0 0', md: '0 0 0' } : { xs: '0 0 35%', md: '1 1 0' },
    width: wholeDay ? { xs: 0, md: 0 } : { xs: '35%', md: 'auto' },
    opacity: wholeDay ? 0 : 1,
    pointerEvents: wholeDay ? 'none' : 'auto',
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
      <DatePicker
        format={DATE_DISPLAY_FORMAT}
        value={dateValue ? dayjs(dateValue) : null}
        onChange={onDateChange}
        slotProps={{ textField: { sx: dateSx } }}
      />

      <TimePicker
        format={TIME_FORMAT}
        value={timeValue ? dayjs(timeValue, TIME_FORMAT) : null}
        onChange={onTimeChange}
        slotProps={{ textField: { sx: timeSx } }}
      />
    </Box>
  );
}
