import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { tv } from 'tailwind-variants';

import { colors } from '@avoo/design-tokens';
import { calendarHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import CalendarMaster, { CALENDAR_MASTER_LAYOUT } from '@/components/CalendarMaster/CalendarMaster';
import { CALENDAR_ORDER_VARIANT, CalendarOrder } from '@/components/CalendarOrder/CalendarOrder';
import { calendarMobileHooks } from '@/hooks/calendarHooks';
import { BottomBarScreens, RootNavigationProp, RootScreens } from '@/types/navigation';

import { CalendarOverflowLabel } from '../CalendarOverflowLabel/CalendarOverflowLabel';

const MAX_ITEMS = 6;

const eventsList = tv({
  base: 'p-2',
  variants: {
    hasEvents: {
      true: 'border border-gray-200 rounded-2xl',
      false: '',
    },
  },
});

export const CalendarWidget = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const handlePress = () => {
    navigation.navigate(RootScreens.BottomBar, { screen: BottomBarScreens.Calendar });
  };
  const today = useMemo(() => new Date(), []);
  const params = useMemo(
    () => ({
      rangeFromDate: timeUtils.formatDate(today),
      rangeToDate: timeUtils.formatDate(today),
    }),
    [today],
  );

  const { data: calendarData } = calendarHooks.useGetCalendar(params);

  const appointments = calendarMobileHooks.useCalendarAppointments(calendarData ?? null);

  const { events: todayEvents, total: totalTodayCount } = useMemo(() => {
    return { events: appointments.slice(0, MAX_ITEMS), total: appointments.length };
  }, [appointments]);

  const dateLabel = timeUtils.formatShortDateLabel(today);

  return (
    <Pressable onPress={handlePress} className='bg-white rounded-2xl p-5 border border-gray-200'>
      <View className='items-start mb-4'>
        <View className='w-full flex-row items-center justify-between gap-2'>
          <Text variant='titleLarge'>Calendar</Text>
          {todayEvents.length > 0 && (
            <CalendarOverflowLabel total={totalTodayCount} maxShown={MAX_ITEMS} />
          )}
        </View>
        <Text variant='bodySmall' style={{ color: colors.gray[700] }}>
          Today, {dateLabel}
        </Text>
      </View>

      <View className={eventsList({ hasEvents: todayEvents.length > 0 })}>
        {todayEvents.length === 0 ? (
          <View className='rounded-lg border border-gray-200 px-6 py-10 items-center justify-center'>
            <Text variant='titleMedium' style={{ textAlign: 'center', marginBottom: 8 }}>
              No appointments today
            </Text>
            <Text variant='bodySmall' style={{ color: colors.gray[500], textAlign: 'center' }}>
              Today's appointments will appear here.
            </Text>
          </View>
        ) : (
          todayEvents.map((event, index) => {
            return (
              <View key={event.id} className='flex-row items-center gap-2 rounded-lg p-2'>
                <CalendarOrder appointment={event} variant={CALENDAR_ORDER_VARIANT.WIDGET} />
                <CalendarMaster
                  master={event.master}
                  borderBottom={false}
                  layout={CALENDAR_MASTER_LAYOUT.INLINE}
                  serviceName={event.service}
                  colorIndex={index}
                />
              </View>
            );
          })
        )}
      </View>
    </Pressable>
  );
};
