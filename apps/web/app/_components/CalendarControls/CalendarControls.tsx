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
import { timeUtils } from '@/_utils/timeUtils';
import CheckboxesButton from '../CheckboxesButton/CheckboxesButton';
import { orderStatus } from '@avoo/hooks/types/orderStatus';
import {
  PrivateCalendarQueryParams,
  MasterWithRelationsEntityResponse,
} from '@avoo/axios/types/apiTypes';
import CalendarViewDay from '@/_icons/CalendarViewDay';
import CalendarViewWeek from '@/_icons/CalendarViewWeek';
import CalendarViewMonth from '@/_icons/CalendarViewMonth';

type Props = {
  date: Date;
  setDate: (date: Date) => void;
  type: calendarViewType;
  setType: (type: calendarViewType) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
  scrollToCurrentTime: () => void;
  params: PrivateCalendarQueryParams;
  setParams: (params: PrivateCalendarQueryParams) => void;
  masters: MasterWithRelationsEntityResponse;
};

const controlsButton = tv({
  base: 'cursor-pointer text-gray-800 border border-gray-200 bg-transparent px-3 py-2.5 text-sm leading-none transition-colors',
  variants: {
    variant: {
      full: 'rounded-2xl',
      left: 'rounded-l-2xl',
      right: 'rounded-r-2xl',
      middle: 'border-x-0',
    },
  },
});

const icon = tv({
  base: 'w-4 h-4 fill-black',
});

export default function CalendarControls(props: Props) {
  const { date, setDate, setToDate, type, setType, scrollToCurrentTime, masters } = props;

  const setCurrentDate = (type: calendarViewType) => {
    const today = new Date();
    if (type === calendarViewType.DAY) {
      const range = timeUtils.getDayRange(today);
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.WEEK) {
      const range = timeUtils.getWeekRange(today);
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.MONTH) {
      const range = timeUtils.getMonthRange(today);
      setDate(range.start);
      setToDate(range.end);
    }
  };

  const setPreviousDate = () => {
    if (type === calendarViewType.DAY) {
      const range = timeUtils.getDayRange(new Date(date.getTime() - 24 * 60 * 60 * 1000));
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.WEEK) {
      const range = timeUtils.getWeekRange(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000));
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.MONTH) {
      const prevMonth = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const range = timeUtils.getMonthRange(prevMonth);
      setDate(range.start);
      setToDate(range.end);
    }
  };

  const setNextDate = () => {
    if (type === calendarViewType.DAY) {
      const range = timeUtils.getDayRange(new Date(date.getTime() + 24 * 60 * 60 * 1000));
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.WEEK) {
      const range = timeUtils.getWeekRange(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.MONTH) {
      const nextMonth = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const range = timeUtils.getMonthRange(nextMonth);
      setDate(range.start);
      setToDate(range.end);
    }
  };

  const handleChangeDate = (newDate: dayjs.Dayjs | null) => {
    if (!newDate) return;
    const newDateObj = newDate.toDate();
    if (type === calendarViewType.DAY) {
      const range = timeUtils.getDayRange(newDateObj);
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.WEEK) {
      const range = timeUtils.getWeekRange(newDateObj);
      setDate(range.start);
      setToDate(range.end);
    } else if (type === calendarViewType.MONTH) {
      const range = timeUtils.getMonthRange(newDateObj);
      setDate(range.start);
      setToDate(range.end);
    }
  };

  const viewOptions = [
    {
      label: 'Day',
      icon: <CalendarViewDay className={icon()} />,
      handler: () => {
        setType(calendarViewType.DAY);
        setCurrentDate(calendarViewType.DAY);
      },
    },
    {
      label: 'Week',
      icon: <CalendarViewWeek className={icon()} />,
      handler: () => {
        setType(calendarViewType.WEEK);
        setCurrentDate(calendarViewType.WEEK);
      },
    },
    {
      label: 'Month',
      icon: <CalendarViewMonth className={icon()} />,
      handler: () => {
        setType(calendarViewType.MONTH);
        setCurrentDate(calendarViewType.MONTH);
      },
    },
  ];

  const statusesOptions = {
    label: 'All statuses',
    handler: () => {},
    items: [
      { label: orderStatus.PENDING, handler: () => {} },
      { label: orderStatus.CONFIRMED, handler: () => {} },
      { label: orderStatus.COMPLETED, handler: () => {} },
    ],
  };

  const mastersOptions = {
    label: 'All masters',
    handler: () => {},
    items: masters?.map((master) => ({ label: master.name, handler: () => {} })) ?? [],
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='bg-primary-50 px-4 py-3 flex gap-3'>
        <button
          type='button'
          className={controlsButton({ variant: 'full' })}
          onClick={() => {
            setCurrentDate(type);
            scrollToCurrentTime();
          }}
        >
          Today
        </button>
        <div className='flex'>
          <button
            type='button'
            className={controlsButton({ variant: 'left' })}
            onClick={setPreviousDate}
          >
            <ArrowBackIcon className='fill-gray-800 w-3.5 h-3.5' />
          </button>
          <DatePicker
            value={dayjs(date)}
            format='DD MMM YYYY'
            onChange={handleChangeDate}
            slotProps={{
              textField: {
                sx: {
                  '& .MuiPickersInputBase-root': {
                    borderRadius: 0,
                  },
                  '& .MuiPickersSectionList-root': {
                    padding: '8px 0',
                    fontSize: '14px',
                    color: 'var(--color-gray-800)',
                    leading: '1.15',
                  },
                },
              },
              openPickerIcon: { className: 'fill-gray-800 w-4 h-4' },
            }}
          />
          <button
            type='button'
            className={controlsButton({ variant: 'right' })}
            onClick={setNextDate}
          >
            <ArrowForwardIcon className='fill-gray-800 w-3.5 h-3.5' />
          </button>
        </div>
        <SelectButton label={type} options={viewOptions} type='outline' />
        <CheckboxesButton addCount label='Masters' options={[mastersOptions]} />
        <CheckboxesButton addCount label='Statuses' options={[statusesOptions]} />
      </div>
    </LocalizationProvider>
  );
}
