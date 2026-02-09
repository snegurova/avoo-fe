import { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { tv } from 'tailwind-variants';
import { PillText } from '@/shared/PillText/PillText';
import { colors } from '@avoo/design-tokens';
import { calendarHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import { calendarMobileHooks } from '@/hooks/calendarHooks';
import { CalendarOrder, CALENDAR_ORDER_VARIANT } from '@/components/CalendarOrder/CalendarOrder';
import CalendarMaster, { CALENDAR_MASTER_LAYOUT } from '@/components/CalendarMaster/CalendarMaster';
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
    <View className='bg-white rounded-2xl p-5 border border-gray-200'>
      <View className='items-start mb-4'>
        <View className='w-full flex-row items-center justify-between gap-2'>
          <Text variant='titleLarge'>Calendar</Text>
          <PillText>
            <CalendarOverflowLabel total={totalTodayCount} maxShown={MAX_ITEMS} />
          </PillText>
        </View>
        <Text variant='bodySmall' style={{ color: colors.gray[700] }}>
          Today, {dateLabel}
        </Text>
      </View>

      <View className={eventsList({ hasEvents: todayEvents.length > 0 })}>
        {todayEvents.length === 0 ? (
          <Text variant='bodyMedium' style={{ color: colors.gray[500] }}>
            No appointments today
          </Text>
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
    </View>
  );
};
