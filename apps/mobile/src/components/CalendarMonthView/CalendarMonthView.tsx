import { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { tv } from 'tailwind-variants';
import type { Appointment } from '@/hooks/calendarHooks';
import CalendarOrder, { CALENDAR_ORDER_VARIANT } from '../CalendarOrder/CalendarOrder';
import { CalendarOverflowLabel } from '../CalendarOverflowLabel/CalendarOverflowLabel';
import { calendarUtils } from '@/utils/calendarUtils';
import { WEEK_DAYS } from '@avoo/constants';
import { calendarConfig } from '../CalendarSection/calendarConfig';

type Props = {
  appointments: Appointment[];
  month: Date;
};

const dayBadge = tv({
  base: 'mt-1 mb-1 h-7 w-7 items-center justify-center rounded-full',
  variants: {
    isToday: {
      true: 'bg-primary-600',
      false: 'bg-transparent',
    },
  },
});

const cell = tv({
  base: 'flex-1 min-h-24 p-0.5',
  variants: {
    hasRightBorder: {
      true: 'border-r border-gray-200',
      false: '',
    },
  },
});

const rowStyles = tv({
  base: 'flex-row border-b border-gray-200',
  variants: {
    isLastRow: {
      true: 'border-b-0',
      false: '',
    },
  },
});

export const CalendarMonthView = (props: Props) => {
  const { appointments, month } = props;
  const days = calendarUtils.getMonthGridDays(month);
  const rows = calendarUtils.getMonthGridRows(days);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const apt of appointments) {
      const arr = map.get(apt.date);
      if (arr) arr.push(apt);
      else map.set(apt.date, [apt]);
    }
    return map;
  }, [appointments]);

  return (
    <View className='flex-1'>
      <View className='flex-row border-b border-gray-200'>
        {WEEK_DAYS.map((day) => (
          <View key={day} className='flex-1 py-2 items-center'>
            <Text variant='labelSmall' style={{ color: colors.gray[600] }}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View>
        {rows.map((row, rowIndex) => {
          const isLastRow = rowIndex === rows.length - 1;
          return (
            <View key={`row-${rowIndex}`} className={rowStyles({ isLastRow })}>
              {row.map((day, colIndex) => {
                const dateKey = calendarUtils.toDateKeyLocal(day);
                const dayAppointments = appointmentsByDate.get(dateKey) ?? [];
                const isLastCol = colIndex === 6;

                return (
                  <View key={dateKey} className={cell({ hasRightBorder: !isLastCol })}>
                    <View className={dayBadge({ isToday: calendarUtils.isToday(day) })}>
                      <Text
                        variant='labelSmall'
                        style={{
                          color: calendarUtils.isToday(day)
                            ? colors.white
                            : calendarUtils.isSameMonth(day, month)
                              ? colors.gray[900]
                              : colors.gray[400],
                        }}
                      >
                        {day.getDate()}
                      </Text>
                    </View>

                    {dayAppointments
                      .slice(0, calendarConfig.monthView.maxEventsPerDay)
                      .map((apt) => (
                        <CalendarOrder
                          key={apt.id}
                          variant={CALENDAR_ORDER_VARIANT.MONTH}
                          appointment={apt}
                          onPress={() => {}}
                        />
                      ))}

                    <CalendarOverflowLabel
                      total={dayAppointments.length}
                      maxShown={calendarConfig.monthView.maxEventsPerDay}
                      style={{ marginTop: 2, fontSize: 9 }}
                    />
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};
