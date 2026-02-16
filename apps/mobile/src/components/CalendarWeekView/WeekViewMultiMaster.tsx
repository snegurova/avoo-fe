import { View } from 'react-native';
import { Appointment } from '@/hooks/calendarHooks';
import CalendarOrder, { CALENDAR_ORDER_VARIANT } from '../CalendarOrder/CalendarOrder';
import { CalendarOverflowLabel } from '../CalendarOverflowLabel/CalendarOverflowLabel';
import { TimelineGridLayout } from '../TimelineGridLayout/TimelineGridLayout';
import { WeekViewLeftColumn } from './WeekViewLeftColumn';
import { calendarUtils } from '@/utils/calendarUtils';
import { calendarConfig } from '../CalendarSection/calendarConfig';
import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { WeekViewHeader } from '../WeekViewHeader/WeekViewHeader';

type Props = {
  masters: ShortMasterInfo[];
  appointments: Appointment[];
  weekDays: Date[];
};

export const WeekViewMultiMaster = ({ masters, appointments, weekDays }: Props) => {
  const { headerHeight, dayWidth, masterColumnWidth, masterRowHeight } = calendarConfig.weekView;
  const contentWidth = weekDays.length * dayWidth;

  return (
    <TimelineGridLayout
      headerHeight={headerHeight}
      stickyHeader={
        <WeekViewHeader
          weekDays={weekDays}
          dayWidth={dayWidth}
          headerHeight={headerHeight}
        />
      }
      hideTimeScale
      leftColumn={<WeekViewLeftColumn masters={masters} masterRowHeight={masterRowHeight} />}
      leftColumnWidth={masterColumnWidth}
    >
      <View style={{ width: contentWidth }}>
        {masters.map((master, masterIndex) => (
          <View
            key={master.id}
            className={
              masterIndex === masters.length - 1
                ? 'flex-row'
                : 'flex-row border-b border-gray-200'
            }
            style={{ height: masterRowHeight }}
          >
            {weekDays.map((day, idx) => {
              const dateKey = calendarUtils.toDateKeyLocal(day);
              const cellAppointments = appointments.filter(
                (a) => String(a.master.id) === String(master.id) && a.date === dateKey,
              );
              const isLastDay = idx === weekDays.length - 1;
              return (
                <View
                  key={`${master.id}-${idx}`}
                  style={{ width: dayWidth }}
                  className={isLastDay ? 'px-1 py-1' : 'border-r border-gray-200 px-1 py-1'}
                >
                  {cellAppointments
                    .slice(0, calendarConfig.weekView.maxEventsPerCell)
                    .map((apt) => (
                      <CalendarOrder
                        key={apt.id}
                        variant={CALENDAR_ORDER_VARIANT.WEEK}
                        appointment={apt}
                        onPress={() => {}}
                      />
                    ))}
                  <CalendarOverflowLabel
                    total={cellAppointments.length}
                    maxShown={calendarConfig.weekView.maxEventsPerCell}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </TimelineGridLayout>
  );
};
