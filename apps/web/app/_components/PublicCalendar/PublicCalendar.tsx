import React, { useCallback, useMemo, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersCalendarHeaderProps } from '@mui/x-date-pickers/PickersCalendarHeader';
import dayjs from 'dayjs';

import {
  Combination,
  MasterWithRelationsEntity,
  PublicCalendarQueryParams,
  PublicWorkingDay,
  Service,
} from '@avoo/axios/types/apiTypes';
import { CALENDAR_DATE_FORMAT } from '@avoo/constants';
import { calendarHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import { localizationHooks } from '@/_hooks/localizationHooks';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';

const MS_IN_MINUTE = 60000;

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
  selectedService?: Service | Combination | null;
  userId: number;
  selectedMaster: MasterWithRelationsEntity | null;
};

export default function PublicCalendar(props: Props) {
  const { date, onChange, selectedService, userId, selectedMaster } = props;

  const locale = localizationHooks.useGetLocale();

  const [currentMonth, setCurrentMonth] = useState(() => (date ? dayjs(date) : dayjs()));
  const [selectedDay, setSelectedDay] = useState(() => (date ? dayjs(date) : null));

  React.useEffect(() => {
    if (date) {
      setSelectedDay(dayjs(date));
      setCurrentMonth(dayjs(date));
    }
  }, [date]);

  const calendarParams = useMemo<PublicCalendarQueryParams>(() => {
    const params: PublicCalendarQueryParams = {
      rangeFromDate: '',
      rangeToDate: '',
      userId: userId,
      masterIds: selectedMaster ? [selectedMaster.id] : undefined,
    };

    if (selectedService) {
      if ('services' in selectedService) {
        params.combinationId = selectedService.id;
      } else {
        params.serviceId = selectedService.id;
      }
    }

    const monthStart = currentMonth.startOf('month');
    const monthEnd = currentMonth.endOf('month');
    const firstVisibleDay = monthStart.startOf('week');
    const lastVisibleDay = monthEnd.endOf('week');

    params.rangeFromDate = timeUtils.formatDate(firstVisibleDay.toDate());
    params.rangeToDate = timeUtils.formatDate(lastVisibleDay.toDate());

    return params;
  }, [userId, selectedService, selectedMaster, currentMonth]);

  const { data: calendarData, isPending } = calendarHooks.useGetPublicCalendar(calendarParams);

  const handleMonthChange = useCallback(
    (newMonth: dayjs.Dayjs) => {
      setCurrentMonth(newMonth);
      setSelectedDay(newMonth.startOf('month').locale(locale));
      onChange?.(newMonth.startOf('month').toDate().toISOString());
    },
    [locale],
  );

  const onValueChange = (newDate: dayjs.Dayjs | null) => {
    setSelectedDay(newDate?.locale(locale) || null);
    if (newDate) {
      setCurrentMonth(newDate);
      onChange?.(newDate.toDate().toISOString());
    } else {
      onChange?.('');
    }
  };

  const shouldDisableDate = useCallback(
    (day: dayjs.Dayjs) => {
      const today = dayjs().startOf('day');
      if (day.isBefore(today, 'day')) return true;

      if (isPending) return false;
      if (!calendarData) return false;

      const dayStr = day.format('YYYY-MM-DD');
      const allDays = Array.isArray(calendarData) ? calendarData.flatMap((item) => item.days) : [];
      const workingDay = allDays.find((d: PublicWorkingDay) => d.date === dayStr);

      if (!workingDay || !workingDay.isWorkingDay) return true;
      if (!Array.isArray(workingDay.availability) || workingDay.availability.length === 0)
        return true;

      const serviceDuration = selectedService?.durationMinutes || 15;
      const fits = workingDay.availability.some((a: { start: string; end: string }) => {
        const start = new Date(a.start);
        const end = new Date(a.end);
        const diff = (end.getTime() - start.getTime()) / MS_IN_MINUTE;
        return diff >= serviceDuration;
      });
      return !fits;
    },
    [calendarData, isPending, selectedService, selectedMaster, currentMonth],
  );

  return (
    <DateCalendar
      value={selectedDay}
      onChange={onValueChange}
      slots={{
        calendarHeader: (props) => (
          <CustomHeader
            {...props}
            currentMonth={currentMonth.locale(locale)}
            onMonthChange={handleMonthChange}
          />
        ),
      }}
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
      showDaysOutsideCurrentMonth
      shouldDisableDate={shouldDisableDate}
      loading={isPending}
    />
  );
}
