'use client';
import React from 'react';
import type { Dayjs } from 'dayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT, TIME_FORMAT } from '@/_constants/dateFormats';

type Props = Readonly<{
  dateValue?: string;
  timeValue?: string;
  wholeDay: boolean;
  onDateChange: (d: Dayjs | null) => void;
  onTimeChange?: (t: Dayjs | null) => void;
  timeLabel?: string;
}>;

export default function DateTimePickers({
  dateValue,
  timeValue,
  wholeDay,
  onDateChange,
  onTimeChange,
  timeLabel,
}: Props) {
  return (
    <>
      {wholeDay ? (
        <div className='mt-3'>
          <DatePicker
            format={DATE_DISPLAY_FORMAT}
            value={dateValue ? dayjs(dateValue) : null}
            onChange={onDateChange}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </div>
      ) : (
        <div className='mt-3 flex flex-col gap-3'>
          <DatePicker
            format={DATE_DISPLAY_FORMAT}
            value={dateValue ? dayjs(dateValue) : null}
            onChange={onDateChange}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <TimePicker
            format={TIME_FORMAT}
            value={timeValue ? dayjs(timeValue, TIME_FORMAT) : null}
            onChange={onTimeChange}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <span className='text-sm text-gray-700'>{timeLabel ?? 'Time'}</span>
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
}
