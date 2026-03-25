import React from 'react';

import IconButton from '@mui/material/IconButton';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersCalendarHeaderProps } from '@mui/x-date-pickers/PickersCalendarHeader';
import dayjs from 'dayjs';

import { CALENDAR_DATE_FORMAT, DATE_TIME_PICKER_FORMAT } from '@avoo/constants';

import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';

function CustomHeader(props: PickersCalendarHeaderProps) {
  const { currentMonth, onMonthChange } = props;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
      }}
    >
      <IconButton onClick={() => onMonthChange(currentMonth.subtract(1, 'month'))}>
        <ArrowBackIcon className='w-3.5 h-3.5' />
      </IconButton>

      <div style={{ fontWeight: 500 }}>{currentMonth.format(CALENDAR_DATE_FORMAT)}</div>

      <IconButton onClick={() => onMonthChange(currentMonth.add(1, 'month'))}>
        <ArrowForwardIcon className='w-3.5 h-3.5' />
      </IconButton>
    </div>
  );
}

type Props = {
  date?: string | null;
  onChange?: (newDate: string) => void;
};

export default function PublicCalendar(props: Props) {
  const { date, onChange } = props;

  const onValueChange = (newDate: dayjs.Dayjs | null) => {
    const convertedDate = newDate ? newDate.format(DATE_TIME_PICKER_FORMAT) : '';
    onChange?.(convertedDate);
  };

  return (
    <DateCalendar
      slots={{ calendarHeader: CustomHeader }}
      sx={{
        width: '100%',
        maxWidth: '100%',
        borderRadius: '8px',
        borderWidth: 1,
        borderColor: 'var(--color-gray-200)',
        '& .MuiDayCalendar-weekContainer': {
          justifyContent: 'space-between',
          padding: '0 12px',
        },
        '& .MuiDayCalendar-header ': {
          justifyContent: 'space-between',
          padding: '0 12px',
        },
      }}
      value={date ? dayjs(date) : null}
      onChange={onValueChange}
      showDaysOutsideCurrentMonth
    />
  );
}
