'use client';
import React, { useCallback, useMemo } from 'react';
import SelectButton from '@/_components/SelectButton/SelectButton';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { tv } from 'tailwind-variants';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@avoo/shared';
import CheckboxesButton from '../CheckboxesButton/CheckboxesButton';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import {
  PrivateCalendarQueryParams,
  MasterWithRelationsEntityResponse,
} from '@avoo/axios/types/apiTypes';
import CalendarViewDay from '@/_icons/CalendarViewDay';
import CalendarViewWeek from '@/_icons/CalendarViewWeek';
import CalendarViewMonth from '@/_icons/CalendarViewMonth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ElementStyleType } from '@avoo/hooks/types/elementStyleType';

const STATUSES_ITEMS = [
  { label: 'Pending', id: OrderStatus.PENDING },
  { label: 'Confirmed', id: OrderStatus.CONFIRMED },
  { label: 'Completed', id: OrderStatus.COMPLETED },
];

type Props = {
  date: Date;
  setDate: (date: Date) => void;
  type: CalendarViewType;
  setType: (type: CalendarViewType) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
  scrollToCurrentTime: () => void;
  params: PrivateCalendarQueryParams;
  setParams: (
    params:
      | PrivateCalendarQueryParams
      | ((prev: PrivateCalendarQueryParams) => PrivateCalendarQueryParams),
  ) => void;
  masters: MasterWithRelationsEntityResponse[];
  masterIds?: number[] | undefined;
  setMasterIds: (
    ids: number[] | undefined | ((prev: number[] | undefined) => number[] | undefined),
  ) => void;
  statuses?: OrderStatus[] | undefined;
  setStatuses: (
    statuses:
      | OrderStatus[]
      | undefined
      | ((prev: OrderStatus[] | undefined) => OrderStatus[] | undefined),
  ) => void;
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
  const {
    date,
    setDate,
    setToDate,
    type,
    setType,
    scrollToCurrentTime,
    masters,
    masterIds,
    setMasterIds,
    statuses,
    setStatuses,
  } = props;

  const tabletUp = useMediaQuery('(min-width:768px)');

  const setCurrentDate = (type: CalendarViewType) => {
    const today = new Date();
    switch (type) {
      case CalendarViewType.DAY: {
        const range = timeUtils.getDayRange(today);
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarViewType.WEEK: {
        const range = timeUtils.getWeekRange(today);
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarViewType.MONTH: {
        const range = timeUtils.getMonthRange(today);
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      default:
        break;
    }
  };

  const setPreviousDate = () => {
    switch (type) {
      case CalendarViewType.DAY: {
        const range = timeUtils.getDayRange(new Date(date.getTime() - 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarViewType.WEEK: {
        const range = timeUtils.getWeekRange(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarViewType.MONTH: {
        const prevMonth = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const range = timeUtils.getMonthRange(prevMonth);
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      default:
        break;
    }
  };

  const setNextDate = () => {
    switch (type) {
      case CalendarViewType.DAY: {
        const range = timeUtils.getDayRange(new Date(date.getTime() + 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarViewType.WEEK: {
        const range = timeUtils.getWeekRange(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarViewType.MONTH: {
        const nextMonth = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const range = timeUtils.getMonthRange(nextMonth);
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      default:
        break;
    }
  };

  const handleChangeDate = useCallback(
    (newDate: dayjs.Dayjs | null) => {
      if (!newDate) return;
      const newDateObj = newDate.toDate();
      switch (type) {
        case CalendarViewType.DAY: {
          const range = timeUtils.getDayRange(newDateObj);
          setDate(range.start);
          setToDate(range.end);
          break;
        }
        case CalendarViewType.WEEK: {
          const range = timeUtils.getWeekRange(newDateObj);
          setDate(range.start);
          setToDate(range.end);
          break;
        }
        case CalendarViewType.MONTH: {
          const range = timeUtils.getMonthRange(newDateObj);
          setDate(range.start);
          setToDate(range.end);
          break;
        }
        default:
          break;
      }
    },
    [type, date],
  );

  const viewOptions = useMemo(
    () => [
      {
        label: 'Day',
        icon: <CalendarViewDay className={icon()} />,
        handler: () => {
          setType(CalendarViewType.DAY);
          setCurrentDate(CalendarViewType.DAY);
        },
      },
      {
        label: 'Week',
        icon: <CalendarViewWeek className={icon()} />,
        handler: () => {
          setType(CalendarViewType.WEEK);
          setCurrentDate(CalendarViewType.WEEK);
        },
      },
      {
        label: 'Month',
        icon: <CalendarViewMonth className={icon()} />,
        handler: () => {
          setType(CalendarViewType.MONTH);
          setCurrentDate(CalendarViewType.MONTH);
        },
      },
    ],
    [],
  );

  const statusesOptions = useMemo(
    () => ({
      label: 'All statuses',
      handler: () => {
        setStatuses((prev) => {
          if (!prev || prev.length === 3) {
            return [];
          } else {
            return undefined;
          }
        });
      },
      items: STATUSES_ITEMS.map((status) => ({
        label: status.label,
        id: status.id,
        handler: () => {
          setStatuses((prev) => {
            if (!prev) {
              return STATUSES_ITEMS.reduce<OrderStatus[]>((acc, s) => {
                if (s.id && s.id !== status.id) {
                  acc.push(s.id);
                }
                return acc;
              }, []);
            } else if (prev?.includes(status.id)) {
              return prev.filter((id) => id !== status.id);
            } else {
              return [...(prev || []), status.id];
            }
          });
        },
      })),
    }),
    [statuses],
  );

  const mastersOptions = useMemo(
    () => ({
      label: 'All masters',
      handler: () => {
        setMasterIds((prev) => {
          if (!prev || prev.length === masters.length) {
            return [];
          } else {
            return undefined;
          }
        });
      },
      items:
        masters?.map((master) => ({
          label: master.name,
          id: master.id,
          handler: () => {
            setMasterIds((prev) => {
              if (!prev) {
                return masters.reduce<number[]>((acc, m) => {
                  if (m.id && m.id !== master.id) {
                    acc.push(m.id);
                  }
                  return acc;
                }, []);
              } else if (prev?.includes(master.id)) {
                return prev.filter((id) => id !== master.id);
              } else {
                return [...(prev || []), master.id];
              }
            });
          },
        })) ?? [],
    }),
    [masters],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='bg-primary-50 px-4 py-3 flex gap-3 relative'>
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
          <DatePicker value={dayjs(date)} format='DD MMM YYYY' onChange={handleChangeDate} />
          <button
            type='button'
            className={controlsButton({ variant: 'right' })}
            onClick={setNextDate}
          >
            <ArrowForwardIcon className='fill-gray-800 w-3.5 h-3.5' />
          </button>
        </div>
        <SelectButton label={type} options={viewOptions} type={ElementStyleType.OUTLINE} />
        {tabletUp ? (
          <>
            <CheckboxesButton
              addCount
              label='Masters'
              options={[mastersOptions]}
              values={[masterIds]}
            />
            <CheckboxesButton
              addCount
              label='Statuses'
              options={[statusesOptions]}
              values={[statuses]}
            />
          </>
        ) : (
          <div className='absolute right-4 bottom-[calc(100%+26px)] translate-y-1/2 z-11'>
            <CheckboxesButton
              label='Options'
              options={[mastersOptions, statusesOptions]}
              values={[masterIds, statuses]}
            />
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}
