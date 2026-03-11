'use client';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import useMediaQuery from '@mui/material/useMediaQuery';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { tv } from 'tailwind-variants';

import {
  MasterWithRelationsEntityResponse,
  PrivateCalendarQueryParams,
} from '@avoo/axios/types/apiTypes';
import { CalendarType } from '@avoo/hooks/types/calendarType';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { ElementStyleType } from '@avoo/hooks/types/elementStyleType';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { messages } from '@avoo/intl/messages/private/calendar/calendar';
import { messages as orderMessages } from '@avoo/intl/messages/private/orders/order';
import { timeUtils } from '@avoo/shared';

import SelectButton from '@/_components/SelectButton/SelectButton';
import { DATE_PICKER_FORMAT } from '@/_constants/dateFormats';
import { localizationHooks } from '@/_hooks/localizationHooks';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';
import CalendarViewDay from '@/_icons/CalendarViewDay';
import CalendarViewMonth from '@/_icons/CalendarViewMonth';
import CalendarViewWeek from '@/_icons/CalendarViewWeek';

import CheckboxesButton from '../CheckboxesButton/CheckboxesButton';

const STATUSES_ITEMS = [
  { label: <FormattedMessage {...orderMessages.pending} />, id: OrderStatus.PENDING },
  { label: <FormattedMessage {...orderMessages.confirmed} />, id: OrderStatus.CONFIRMED },
  { label: <FormattedMessage {...orderMessages.completed} />, id: OrderStatus.COMPLETED },
];

type Props = {
  scrollToCurrentTime: () => void;
  params: PrivateCalendarQueryParams;
  setParams: (
    params:
      | PrivateCalendarQueryParams
      | ((prev: PrivateCalendarQueryParams) => PrivateCalendarQueryParams),
  ) => void;
  masters: MasterWithRelationsEntityResponse[];
  calendarType: CalendarType;
};

const controlsButton = tv({
  base: 'cursor-pointer text-gray-800 border border-gray-200 bg-transparent px-3 py-2.5 text-sm leading-none transition-colors hover:bg-primary-200 focus:bg-primary-200',
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

const showOptionsWrapper = tv({
  base: 'absolute right-4 bottom-[calc(100%+30px)] translate-y-1/2 z-11',
  variants: {
    calendarType: {
      [CalendarType.REGULAR]: '',
      [CalendarType.WIDGET]: '',
      [CalendarType.SELECTOR]: '',
    },
  },
});

import { useCalendarStore } from '@avoo/store';

export default function CalendarControls(props: Props) {
  const { scrollToCurrentTime, masters, calendarType } = props;
  const date = useCalendarStore((state) => state.date);
  const setDate = useCalendarStore((state) => state.setDate);
  const setToDate = useCalendarStore((state) => state.setToDate);
  const type = useCalendarStore((state) => state.type);
  const setType = useCalendarStore((state) => state.setType);
  const masterIds = useCalendarStore((state) => state.masterIds);
  const setMasterIds = useCalendarStore((state) => state.setMasterIds);
  const statuses = useCalendarStore((state) => state.statuses);
  const setStatuses = useCalendarStore((state) => state.setStatuses);
  const orderIsOutOfSchedule = useCalendarStore((state) => state.orderIsOutOfSchedule);
  const setOrderIsOutOfSchedule = useCalendarStore((state) => state.setOrderIsOutOfSchedule);

  const locale = localizationHooks.useGetLocale();

  const tabletUp = useMediaQuery('(min-width:768px)');
  const desktopLargeUp = useMediaQuery('(min-width:1280px)');
  const showOptions = useMemo(() => {
    if (calendarType === CalendarType.REGULAR) {
      return desktopLargeUp;
    } else if (calendarType === CalendarType.WIDGET) {
      return tabletUp;
    } else {
      return false;
    }
  }, [tabletUp, desktopLargeUp, calendarType]);

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
        const prevMonth = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
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
    [type, setDate, setToDate],
  );

  const viewOptions = useMemo(
    () => [
      {
        label: <FormattedMessage {...messages.day} />,
        icon: <CalendarViewDay className={icon()} />,
        handler: () => {
          setType(CalendarViewType.DAY);
          setCurrentDate(CalendarViewType.DAY);
        },
      },
      {
        label: <FormattedMessage {...messages.week} />,
        icon: <CalendarViewWeek className={icon()} />,
        handler: () => {
          setType(CalendarViewType.WEEK);
          setCurrentDate(CalendarViewType.WEEK);
        },
      },
      {
        label: <FormattedMessage {...messages.month} />,
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
      label: <FormattedMessage {...messages.allStatusesLabel} />,
      handler: () => {
        if (!statuses || statuses.length === 3) {
          setStatuses([]);
        } else {
          setStatuses(undefined);
        }
      },
      items: STATUSES_ITEMS.map((status) => ({
        label: status.label,
        id: status.id,
        handler: () => {
          if (!statuses) {
            setStatuses(
              STATUSES_ITEMS.reduce<OrderStatus[]>((acc, s) => {
                if (s.id && s.id !== status.id) {
                  acc.push(s.id);
                }
                return acc;
              }, []),
            );
          } else if (statuses?.includes(status.id)) {
            setStatuses(statuses.filter((id: OrderStatus) => id !== status.id));
          } else {
            setStatuses([...(statuses || []), status.id]);
          }
        },
      })),
    }),
    [statuses],
  );

  const mastersOptions = useMemo(
    () => ({
      label: <FormattedMessage {...messages.allMastersLabel} />,
      handler: () => {
        if (!masterIds || masterIds.length === masters.length) {
          setMasterIds([]);
        } else {
          setMasterIds(undefined);
        }
      },
      items:
        masters?.map((master) => ({
          label: master.name,
          id: master.id,
          handler: () => {
            if (!masterIds) {
              setMasterIds(
                masters.reduce<number[]>((acc, m) => {
                  if (m.id && m.id !== master.id) {
                    acc.push(m.id);
                  }
                  return acc;
                }, []),
              );
            } else if (masterIds?.includes(master.id)) {
              setMasterIds(masterIds.filter((id: number) => id !== master.id));
            } else {
              setMasterIds([...(masterIds || []), master.id]);
            }
          },
        })) ?? [],
    }),
    [masters, masterIds],
  );

  const outOfCheduleOptions = useMemo(
    () => ({
      label: <FormattedMessage {...messages.outOfScheduleLabel} />,
      handler: () => {
        if (orderIsOutOfSchedule === undefined) {
          setOrderIsOutOfSchedule(true);
        } else {
          setOrderIsOutOfSchedule(undefined);
        }
      },
    }),
    [orderIsOutOfSchedule],
  );

  const calendarButtonStyles = {
    opacity: 0,
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <div className='bg-primary-50 px-4 py-3 flex gap-3 relative'>
        <button
          type='button'
          className={controlsButton({ variant: 'full' })}
          onClick={() => {
            setCurrentDate(type);
            scrollToCurrentTime();
          }}
        >
          <FormattedMessage {...messages.todayButton} />
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
            format={DATE_PICKER_FORMAT}
            onChange={handleChangeDate}
            sx={{
              '& .MuiButtonBase-root': calendarButtonStyles,
              transition: 'background-color 0.15s',
              '&:hover': {
                backgroundColor: 'var(--color-primary-200)',
              },
              '&:focus': {
                backgroundColor: 'var(--color-primary-200)',
              },
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
        <SelectButton
          label={<FormattedMessage {...messages[type]} />}
          options={viewOptions}
          type={ElementStyleType.OUTLINE}
        />
        {showOptions ? (
          <>
            <CheckboxesButton
              addCount
              label={<FormattedMessage {...messages.mastersLabel} />}
              options={[mastersOptions]}
              values={[masterIds]}
            />
            <CheckboxesButton
              addCount
              label={<FormattedMessage {...messages.statusesLabel} />}
              options={[statusesOptions, outOfCheduleOptions]}
              values={[statuses, orderIsOutOfSchedule]}
            />
          </>
        ) : (
          <div className={showOptionsWrapper({ calendarType })}>
            <CheckboxesButton
              label={<FormattedMessage {...messages.optionsLabel} />}
              options={[mastersOptions, statusesOptions, outOfCheduleOptions]}
              values={[masterIds, statuses, orderIsOutOfSchedule]}
            />
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}
