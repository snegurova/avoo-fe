import { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';
import { CalendarView } from '@avoo/axios/types/apiTypes';
import { CalendarViewTypeSheet } from '../CalendarViewTypeSheet/CalendarViewTypeSheet';
import { CalendarMastersSheet } from '../CalendarMastersSheet/CalendarMastersSheet';
import { CalendarStatusesSheet, CALENDAR_STATUSES } from '../CalendarStatusesSheet/CalendarStatusesSheet';
import { Master } from '../CalendarSection/CalendarSection';


type Props = {
  dateString: string;
  masters: Master[];
  date: Date;
  setDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  viewType: CalendarView;
  setViewType: (view: CalendarView) => void;
  monthAnchor: Date;
  selectedMasterIds: Set<string>;
  setSelectedMasterIds: (ids: Set<string>) => void;
  selectedStatuses: Set<OrderStatus>;
  setSelectedStatuses: (statuses: Set<OrderStatus>) => void;
};

export const CalendarHeader = (props: Props) => {
  const {
    dateString,
    masters,
    date,
    setDate,
    setToDate,
    viewType,
    setViewType,
    monthAnchor,
    selectedMasterIds,
    setSelectedMasterIds,
    selectedStatuses,
    setSelectedStatuses,
  } = props;
  const [isViewSheetVisible, setIsViewSheetVisible] = useState(false);
  const [isMastersSheetVisible, setIsMastersSheetVisible] = useState(false);
  const [isStatusesSheetVisible, setIsStatusesSheetVisible] = useState(false);

  const isAllTeamSelected =
    selectedMasterIds.size === 0 || selectedMasterIds.size === masters.length;
  const isAllStatusesSelected =
    selectedStatuses.size === 0 || selectedStatuses.size === CALENDAR_STATUSES.length;

  const getSelectedMastersText = () => {
    if (isAllTeamSelected) return 'All masters';
    if (selectedMasterIds.size === 0) return 'No masters';
    if (selectedMasterIds.size === 1) {
      const master = masters.find((m) => selectedMasterIds.has(m.id));
      return master?.name || 'All masters';
    }
    return `${selectedMasterIds.size} masters`;
  };

  const getSelectedStatusesText = () => {
    if (isAllStatusesSelected || selectedStatuses.size === CALENDAR_STATUSES.length) {
      return 'All Statuses';
    }
    if (selectedStatuses.size === 0) return 'No Statuses';
    if (selectedStatuses.size === 1) {
      const status = CALENDAR_STATUSES.find((s) => selectedStatuses.has(s.id));
      return status?.label || 'All Statuses';
    }
    return `${selectedStatuses.size} Statuses`;
  };

  const setPreviousDate = () => {
    switch (viewType) {
      case CalendarView.Day: {
        const range = timeUtils.getDayRange(new Date(date.getTime() - 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarView.Week: {
        const range = timeUtils.getWeekRange(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarView.Month: {
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
    switch (viewType) {
      case CalendarView.Day: {
        const range = timeUtils.getDayRange(new Date(date.getTime() + 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarView.Week: {
        const range = timeUtils.getWeekRange(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
        setDate(range.start);
        setToDate(range.end);
        break;
      }
      case CalendarView.Month: {
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

  const displayedDateLabel =
    viewType === CalendarView.Month
      ? monthAnchor.toLocaleDateString('en-US', { month: 'long' })
      : dateString;

  return (
    <>
      <View className='border-b border-gray-200'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateNavigationContent}
        >
          <Pressable className='px-3 py-2.5 border border-gray-200 rounded-xl'>
            <Text variant='bodyMedium'>Today</Text>
          </Pressable>

          <View className='border border-gray-200 rounded-xl flex-row items-center'>
            <Pressable className='px-2.5' onPress={setPreviousDate} hitSlop={20}>
              <MaterialIcons name='chevron-left' size={14} color={colors.black} />
            </Pressable>
            <View className='border-r border-l border-gray-200 py-2.5 px-3'>
              <Text variant='bodyMedium'>{displayedDateLabel}</Text>
            </View>
            <Pressable className='px-2.5' onPress={setNextDate} hitSlop={20}>
              <MaterialIcons name='chevron-right' size={14} color={colors.black} />
            </Pressable>
          </View>

          <Pressable
            className='px-3 py-2.5 border border-gray-200 rounded-xl'
            onPress={() => setIsViewSheetVisible(true)}
          >
            <Text variant='bodyMedium'>{viewType.charAt(0).toUpperCase() + viewType.slice(1)}</Text>
          </Pressable>
          <Pressable
            className='px-3 py-2.5 border border-gray-200 rounded-xl'
            onPress={() => setIsMastersSheetVisible(true)}
          >
            <Text variant='bodyMedium'>{getSelectedMastersText()}</Text>
          </Pressable>
          <Pressable
            className='px-3 py-2.5 border border-gray-200 rounded-xl'
            onPress={() => setIsStatusesSheetVisible(true)}
          >
            <Text variant='bodyMedium'>{getSelectedStatusesText()}</Text>
          </Pressable>
        </ScrollView>
      </View>

      <CalendarViewTypeSheet
        visible={isViewSheetVisible}
        onClose={() => setIsViewSheetVisible(false)}
        setViewType={setViewType}
        setDate={setDate}
        setToDate={setToDate}
      />

      <CalendarMastersSheet
        visible={isMastersSheetVisible}
        onClose={() => setIsMastersSheetVisible(false)}
        masters={masters}
        selectedMasterIds={selectedMasterIds}
        setSelectedMasterIds={setSelectedMasterIds}
      />

      <CalendarStatusesSheet
        visible={isStatusesSheetVisible}
        onClose={() => setIsStatusesSheetVisible(false)}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dateNavigationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
});
