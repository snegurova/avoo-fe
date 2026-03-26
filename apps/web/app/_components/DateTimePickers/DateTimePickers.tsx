'use client';
import React from 'react';

import Box from '@mui/material/Box';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { DATE_DISPLAY_FORMAT, TIME_FORMAT, VALUE_DATE_FORMAT } from '@avoo/constants';

export enum DateTimePickersVariant {
  Default = 'default',
  Modal = 'modal',
}

type Props = Readonly<{
  dateValue?: string;
  timeValue?: string;
  wholeDay: boolean;
  hasError?: boolean;
  variant?: DateTimePickersVariant;
  onDateChange: (d: Dayjs | null) => void;
  onTimeChange?: (t: Dayjs | null) => void;
}>;

const getPickerFieldStyles = (wholeDay: boolean, isModalVariant: boolean) => {
  const stateKey = wholeDay ? 'whole' : 'partial';
  const variantKey = isModalVariant ? 'modal' : 'default';

  const styleMap = {
    whole: {
      dateFlex: {
        default: { xs: '1 1 100%', md: '1 1 0' },
        modal: { xs: '1 1 100%', md: '1 1 100%' },
      },
      dateWidth: { default: { xs: '100%', md: 'auto' }, modal: { xs: '100%', md: '100%' } },
      timeFlex: { default: { xs: '0 0 0', md: '0 0 0' }, modal: { xs: '0 0 0', md: '0 0 0' } },
      timeWidth: { default: { xs: 0, md: 0 }, modal: { xs: 0, md: 0 } },
    },
    partial: {
      dateFlex: {
        default: { xs: '0 0 65%', md: '1 1 0' },
        modal: { xs: '0 0 65%', md: '0 0 65%' },
      },
      dateWidth: { default: { xs: '65%', md: 'auto' }, modal: { xs: '65%', md: '65%' } },
      timeFlex: {
        default: { xs: '0 0 35%', md: '1 1 0' },
        modal: { xs: '0 0 35%', md: '0 0 35%' },
      },
      timeWidth: { default: { xs: '35%', md: 'auto' }, modal: { xs: '35%', md: '35%' } },
    },
  };

  const stateStyles = styleMap[stateKey];
  return {
    dateFlex: stateStyles.dateFlex[variantKey],
    dateWidth: stateStyles.dateWidth[variantKey],
    timeFlex: stateStyles.timeFlex[variantKey],
    timeWidth: stateStyles.timeWidth[variantKey],
  };
};

export default function DateTimePickers({
  dateValue,
  timeValue,
  wholeDay,
  hasError = false,
  variant = DateTimePickersVariant.Default,
  onDateChange,
  onTimeChange,
}: Props) {
  const transition = 'flex-basis 300ms ease, width 300ms ease, opacity 300ms ease';
  const isModalVariant = variant === DateTimePickersVariant.Modal;
  const { dateFlex, dateWidth, timeFlex, timeWidth } = getPickerFieldStyles(
    wholeDay,
    isModalVariant,
  );
  const selectedDate = dateValue ? dayjs(dateValue, VALUE_DATE_FORMAT, true) : null;
  const selectedTime = timeValue ? dayjs(timeValue, TIME_FORMAT, true) : null;
  const timePickerDateTimeValue =
    selectedDate && selectedTime
      ? selectedDate.hour(selectedTime.hour()).minute(selectedTime.minute())
      : selectedTime;

  const dateSx = {
    '& .MuiPickersInputBase-root': { borderRadius: 1, height: 44 },
    minWidth: 0,
    transition,
    flex: dateFlex,
    width: dateWidth,
  };

  const timeSx = {
    '& .MuiPickersInputBase-root': { borderRadius: 1, height: 44 },
    minWidth: 0,
    transition,
    flex: timeFlex,
    width: timeWidth,
    opacity: wholeDay ? 0 : 1,
    pointerEvents: wholeDay ? 'none' : 'auto',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: wholeDay ? 0 : 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <DatePicker
        format={DATE_DISPLAY_FORMAT}
        value={selectedDate}
        onChange={onDateChange}
        slotProps={{ textField: { sx: dateSx, error: hasError } }}
      />

      <TimePicker
        ampm={false}
        format={TIME_FORMAT}
        views={['hours', 'minutes']}
        minutesStep={15}
        timeSteps={{ minutes: 15 }}
        closeOnSelect={true}
        value={timePickerDateTimeValue}
        onChange={onTimeChange}
        slotProps={{ textField: { sx: timeSx, error: hasError } }}
      />
    </Box>
  );
}
