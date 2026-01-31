import { useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader';
import { calendarHooks, masterHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { CalendarView, PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';
import { useCalendarAppointments } from '@/hooks/calendarHooks';
import { CalendarDayView } from '../CalendarDayView/CalendarDayView';
import { CalendarWeekView } from '../CalendarWeekView/CalendarWeekView';
import { CalendarMonthView } from '../CalendarMonthView/CalendarMonthView';

export type Master = {
  id: string;
  name: string;
  initial: string;
};

export const CalendarSection = () => {
  const [date, setDate] = useState<Date>(timeUtils.toDayBegin(new Date()));
  const [toDate, setToDate] = useState<Date>(timeUtils.toDayEnd(new Date()));
  const [viewType, setViewType] = useState<CalendarView>(CalendarView.Day);
  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: timeUtils.formatDate(date),
    rangeToDate: timeUtils.formatDate(toDate),
  });

  const [selectedMasterIds, setSelectedMasterIds] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<OrderStatus>>(new Set());

  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const mastersData = masterHooks.useGetMastersProfileInfo()?.items;
  const masters = useMemo((): Master[] => {
    if (!mastersData) return [];
    return mastersData.map((master) => ({
      id: String(master.id),
      name: master.name || 'Unknown',
      initial: (master.name || 'U').charAt(0).toUpperCase(),
      avatarColor: colors.primary[400],
    }));
  }, [mastersData]);

  const filteredMasters = useMemo(() => {
    if (selectedMasterIds.size === 0 || selectedMasterIds.size === masters.length) {
      return masters;
    }
    return masters.filter((m) => selectedMasterIds.has(m.id));
  }, [masters, selectedMasterIds]);

  const masterIdsForApi = useMemo(() => {
    if (selectedMasterIds.size === 0 || selectedMasterIds.size === masters.length) {
      return undefined;
    }
    return Array.from(selectedMasterIds).map(Number);
  }, [selectedMasterIds, masters.length]);

  const statusesForApi = useMemo(() => {
    if (selectedStatuses.size === 0 || selectedStatuses.size === 5) {
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

  const calendarData = calendarHooks.useGetCalendar(params);
  const appointments = useCalendarAppointments(calendarData);


  const monthAnchor = useMemo(() => {
    const mid = new Date((date.getTime() + toDate.getTime()) / 2);
    return new Date(mid.getFullYear(), mid.getMonth(), 1, 12, 0, 0, 0);
  }, [date, toDate]);

  return (
    <View className='flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden'>
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

      {viewType === CalendarView.Day && (
        <CalendarDayView masters={filteredMasters} appointments={appointments} />
      )}
      {viewType === CalendarView.Week  && (
        <CalendarWeekView masters={filteredMasters} appointments={appointments} weekStart={date} />
      )}
      {viewType === CalendarView.Month && (
        <CalendarMonthView appointments={appointments} month={monthAnchor} />
      )}
    </View>
  );
};
