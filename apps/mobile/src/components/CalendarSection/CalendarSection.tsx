import { useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { layoutHooks } from '@/hooks/layoutHooks';
import { CALENDAR_STATUSES } from '../CalendarStatusesSheet/CalendarStatusesSheet';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader';
import { calendarHooks } from '@avoo/hooks';
import { timeUtils, isFullSelection } from '@avoo/shared';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import type { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { calendarMobileHooks } from '@/hooks/calendarHooks';
import { CalendarDayView } from '../CalendarDayView/CalendarDayView';
import { CalendarWeekView } from '../CalendarWeekView/CalendarWeekView';
import { CalendarMonthView } from '../CalendarMonthView/CalendarMonthView';

export const CalendarSection = () => {
  const bottomBarHeight = layoutHooks.useBottomBarHeight();
  const [date, setDate] = useState<Date>(timeUtils.toDayBegin(new Date()));
  const [toDate, setToDate] = useState<Date>(timeUtils.toDayEnd(new Date()));
  const [viewType, setViewType] = useState<CalendarViewType>(CalendarViewType.DAY);
  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: timeUtils.formatDate(date),
    rangeToDate: timeUtils.formatDate(toDate),
  });

  const [selectedMasterIds, setSelectedMasterIds] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<OrderStatus>>(new Set());

  const dateString = timeUtils.formatShortDateLabel(date);

  const { data: calendarData } = calendarHooks.useGetCalendar(params);

  const masters = calendarMobileHooks.useCalendarMasters(calendarData ?? null);

  const filteredMasters = useMemo(() => {
    if (isFullSelection(selectedMasterIds.size, masters.length)) {
      return masters;
    }
    return masters.filter((m) => selectedMasterIds.has(String(m.id)));
  }, [masters, selectedMasterIds]);

  const masterIdsForApi = useMemo(() => {
    if (isFullSelection(selectedMasterIds.size, masters.length)) {
      return undefined;
    }
    return Array.from(selectedMasterIds).map(Number);
  }, [selectedMasterIds, masters.length]);

  const statusesForApi = useMemo(() => {
    if (isFullSelection(selectedStatuses.size, CALENDAR_STATUSES.length)) {
      return undefined;
    }
    return Array.from(selectedStatuses);
  }, [selectedStatuses]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      rangeFromDate: timeUtils.formatDate(date),
      rangeToDate: timeUtils.formatDate(toDate),
      masterIds: masterIdsForApi,
      orderStatus: statusesForApi,
    }));
  }, [date, toDate, masterIdsForApi, statusesForApi]);

  const appointments = calendarMobileHooks.useCalendarAppointments(calendarData ?? null);

  const monthAnchor = useMemo(() => {
    const mid = new Date((date.getTime() + toDate.getTime()) / 2);
    return new Date(mid.getFullYear(), mid.getMonth(), 1, 12, 0, 0, 0);
  }, [date, toDate]);


  return (
    <View className='flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden' style={{ marginBottom: bottomBarHeight }}>
      <Text variant='titleLarge' className='px-4 pt-3'>
        Calendar
      </Text>

      <CalendarHeader
        monthAnchor={monthAnchor}
        date={date}
        setDate={setDate}
        setToDate={setToDate}
        dateString={dateString}
        masters={masters}
        viewType={viewType}
        setViewType={setViewType}
        selectedMasterIds={selectedMasterIds}
        setSelectedMasterIds={setSelectedMasterIds}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />

      {viewType === CalendarViewType.DAY && (
        <CalendarDayView masters={filteredMasters} appointments={appointments} />
      )}
      {viewType === CalendarViewType.WEEK && (
        <CalendarWeekView masters={filteredMasters} appointments={appointments} weekStart={date} />
      )}
      {viewType === CalendarViewType.MONTH && (
        <CalendarMonthView appointments={appointments} month={monthAnchor} />
      )}
    </View>
  );
};
