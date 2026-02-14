// CalendarDayView.tsx
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { CALENDAR_ORDER_VARIANT, CalendarOrder } from '../CalendarOrder/CalendarOrder';
import { CalendarDayViewHeader } from '../CalendarDayViewHeader/CalendarDayViewHeader';
import { TimelineGridLayout } from '../TimelineGridLayout/TimelineGridLayout';
import { TimelineColumn } from '../TimelineColumn/TimelineColumn';
import { CurrentTimeLine } from '../CurrentTimeLine/CurrentTimeLine';

import { calendarConfig } from '../CalendarSection/calendarConfig';
import { calendarUtils } from '@/utils/calendarUtils';

import type { Appointment } from '@/hooks/calendarHooks';
import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';

type Props = {
  masters: ShortMasterInfo[];
  appointments: Appointment[];
};

export const CalendarDayView = ({ masters, appointments }: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const availableWidth = Math.max(0, containerWidth - calendarConfig.timeline.timeScaleWidth);

  const colWidth = useMemo(
    () =>
      calendarUtils.getDayViewColWidth(
        availableWidth,
        masters.length,
        calendarConfig.dayView.baseColWidth,
      ),
    [availableWidth, masters.length],
  );

  const contentWidth = useMemo(() => colWidth * masters.length, [colWidth, masters.length]);

  const appointmentsByMaster = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const key = String(appointment.master.id);
      const arr = map.get(key) ?? [];
      arr.push(appointment);
      map.set(key, arr);
    }
    return map;
  }, [appointments]);

  return (
    <View className='flex-1' onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <TimelineGridLayout
        headerHeight={calendarConfig.dayView.headerHeight}
        stickyHeader={
          <CalendarDayViewHeader masters={masters} contentWidth={contentWidth} colWidth={colWidth} />
        }
      >
        <View className='flex-row' style={{ width: contentWidth }}>
          {masters.map((master, index) => {
            const masterAppointments = appointmentsByMaster.get(String(master.id)) ?? [];
            const isLast = index === masters.length - 1;
            return (
              <View
                key={master.id}
                style={{ width: colWidth }}
                className={isLast ? 'relative' : 'border-r border-gray-200 relative'}
              >
                <TimelineColumn columnKey={`day-${master.id}`} width={colWidth} borderRight={false}>
                  {masterAppointments.map((apt) => (
                    <CalendarOrder
                      key={apt.id}
                      variant={CALENDAR_ORDER_VARIANT.DAY}
                      appointment={apt}
                      top={calendarUtils.calculateTop(
                        apt.startTime,
                        calendarConfig.timeline.slotHeight,
                      )}
                      height={calendarUtils.calculateHeight(
                        apt.startTime,
                        apt.endTime,
                        calendarConfig.timeline.slotHeight,
                      )}
                      onPress={() => {}}
                    />
                  ))}
                  <CurrentTimeLine />
                </TimelineColumn>
              </View>
            );
          })}
        </View>
      </TimelineGridLayout>
    </View>
  );
};
