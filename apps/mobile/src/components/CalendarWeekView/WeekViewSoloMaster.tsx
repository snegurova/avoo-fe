import { View } from 'react-native';
import { Appointment } from '@/hooks/calendarHooks';
import CalendarOrder, { CALENDAR_ORDER_VARIANT } from '../CalendarOrder/CalendarOrder';
import { TimelineColumn } from '../TimelineColumn/TimelineColumn';
import { TimelineGridLayout } from '../TimelineGridLayout/TimelineGridLayout';
import { calendarUtils } from '@/utils/calendarUtils';
import { calendarConfig } from '../CalendarSection/calendarConfig';
import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { WeekViewHeader } from '../WeekViewHeader/WeekViewHeader';

type Props = {
  masters: ShortMasterInfo[];
  appointments: Appointment[];
  weekDays: Date[];
};

export const WeekViewSoloMaster = (props: Props) => {
  const { masters, appointments, weekDays } = props;
  const { headerHeight, dayWidth } = calendarConfig.weekSingleMaster;
  const slotHeight = calendarConfig.timeline.slotHeight;
  const masterId = masters[0] != null ? String(masters[0].id) : undefined;
  const contentWidth = weekDays.length * dayWidth;

  return (
    <TimelineGridLayout
      headerHeight={headerHeight}
      stickyHeader={
        <WeekViewHeader weekDays={weekDays} dayWidth={dayWidth} headerHeight={headerHeight} />
      }
    >
      <View className='flex-row' style={{ width: contentWidth }}>
        {weekDays.map((day, idx) => {
          const dateKey = calendarUtils.toDateKeyLocal(day);
          const dayAppointments = appointments
            .filter((a) => String(a.master.id) === masterId && a.date === dateKey)
            .map((apt) => ({
              ...apt,
              top: calendarUtils.calculateTop(apt.startTime, slotHeight),
              height: calendarUtils.calculateHeight(apt.startTime, apt.endTime, slotHeight),
            }));
          return (
            <TimelineColumn
              key={`${dateKey}-${idx}`}
              columnKey={`week-${dateKey}`}
              width={dayWidth}
            >
              {dayAppointments.map((apt) => (
                <CalendarOrder
                  key={apt.id}
                  variant={CALENDAR_ORDER_VARIANT.DAY}
                  appointment={apt}
                  top={apt.top}
                  height={apt.height}
                  onPress={() => {}}
                />
              ))}
            </TimelineColumn>
          );
        })}
      </View>
    </TimelineGridLayout>
  );
};
