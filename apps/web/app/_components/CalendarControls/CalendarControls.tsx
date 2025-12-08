'use client';
import React from 'react';
import SelectButton from '@/_components/SelectButton/SelectButton';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { tv } from 'tailwind-variants';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import CalendarEventIcon from '@/_icons/CalendarEventIcon';
import { timeUtils } from '@/_utils/timeUtils';

type Props = {
  date: Date;
  setDate: (date: Date) => void;
  type: calendarViewType;
  setType: (type: calendarViewType) => void;
};

const controlsButton = tv({
  base: 'cursor-pointer text-contorlsText border border-controlsBorder bg-transparent px-3 py-2.5 text-sm leading-none transition-colors',
  variants: {
    variant: {
      full: 'rounded-2xl',
      left: 'rounded-l-2xl',
      right: 'rounded-r-2xl',
      middle: 'border-x-0',
    },
  },
});

export default function CalendarControls(props: Props) {
  const { date, setDate, type, setType } = props;

  const setCurrentDate = () => {
    setDate(timeUtils.toDayBegin(new Date()));
  };
  const setPreviousDate = () => {
    setDate(new Date(date.getTime() - 24 * 60 * 60 * 1000));
  };
  const setNextDate = () => {
    setDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
  };

  const options = [
    {
      label: 'Day',
      handler: () => {
        setType(calendarViewType.DAY);
      },
    },
    {
      label: 'Week',
      handler: () => {
        setType(calendarViewType.WEEK);
      },
    },
    {
      label: 'Month',
      handler: () => {
        setType(calendarViewType.MONTH);
      },
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='bg-controls px-4 py-3 flex gap-3'>
        <button
          type='button'
          className={controlsButton({ variant: 'full' })}
          onClick={setCurrentDate}
        >
          Today
        </button>
        <div className='flex'>
          <button
            type='button'
            className={controlsButton({ variant: 'left' })}
            onClick={setPreviousDate}
          >
            <ArrowBackIcon className='fill-contorlsText w-3.5 h-3.5' />
          </button>
          <DatePicker
            value={dayjs(date)}
            format='DD MMM YYYY'
            onChange={(newDate) => {
              if (newDate) setDate(newDate.toDate());
            }}
            slots={{
              openPickerIcon: CalendarEventIcon,
            }}
            slotProps={{
              textField: {
                sx: {
                  '& .MuiPickersInputBase-root': {
                    borderRadius: 0,
                  },
                  '& .MuiPickersSectionList-root': {
                    padding: '8px 0',
                    fontSize: '14px',
                    color: 'var(--color-contorlsText)',
                    leading: '1.15',
                  },
                },
              },
              openPickerIcon: { className: 'fill-contorlsText w-4 h-4' },
            }}
          />
          <button
            type='button'
            className={controlsButton({ variant: 'right' })}
            onClick={setNextDate}
          >
            <ArrowForwardIcon className='fill-contorlsText w-3.5 h-3.5' />
          </button>
        </div>
        <SelectButton label={type} options={options} type='outline' />
      </div>
    </LocalizationProvider>
  );
}
