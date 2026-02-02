import { View, ScrollView } from 'react-native';
import { Appointment } from '@/hooks/calendarHooks';
import CalendarOrder, { CALENDAR_ORDER_VARIANT } from '../CalendarOrder/CalendarOrder';
import { CalendarOverflowLabel } from '../CalendarOverflowLabel/CalendarOverflowLabel';
import CalendarMaster from '../CalendarMaster/CalendarMaster';
import { TimelineColumn } from '../TimelineColumn/TimelineColumn';
import { TimelineGridLayout } from '../TimelineGridLayout/TimelineGridLayout';
import { calendarUtils } from '@/utils/calendarUtils';
import { WEEK_DAYS } from '@avoo/constants';
import { calendarConfig } from '../CalendarSection/calendarConfig';
import { Master } from '../CalendarSection/CalendarSection';
import { WeekViewHeader } from '../WeekViewHeader/WeekViewHeader';

type Props = {
  masters: Master[];
  appointments: Appointment[];
  weekStart: Date;
};

export const CalendarWeekView = (props: Props) => {
  const { masters, appointments, weekStart } = props;

  const weekDays = WEEK_DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const isSingleMaster = masters.length === 1;

  const { headerHeight, dayWidth } = calendarConfig.weekSingleMaster;
  const slotHeight = calendarConfig.timeline.slotHeight;
  const masterId = masters?.[0]?.id;
  return (
    <View className='flex-1'>
      {isSingleMaster ? (
        <TimelineGridLayout headerHeight={headerHeight}>
          <View>
            <WeekViewHeader weekDays={weekDays} dayWidth={dayWidth} headerHeight={headerHeight} />
            <View className='flex-row'>
              {weekDays.map((day, idx) => {
                const dateKey = calendarUtils.toDateKeyLocal(day);
                const dayAppointments = appointments
                  .filter((a) => a.masterId === masterId && a.date === dateKey)
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
          </View>
        </TimelineGridLayout>
      ) : (
        <View className='flex-row'>
          <View
            style={{ width: calendarConfig.weekView.masterColumnWidth }}
            className='border-r border-gray-200'
          >
            <View
              style={{ height: calendarConfig.weekView.headerHeight + 1 }}
              className='border-b border-gray-200'
            />
            {masters.map((master, idx) => (
              <CalendarMaster
                key={master.id}
                master={master}
                headerHeight={calendarConfig.weekView.masterRowHeight}
                borderBottom={idx < masters.length - 1}
              />
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
            <View>
              <WeekViewHeader
                weekDays={weekDays}
                dayWidth={calendarConfig.weekView.dayWidth}
                headerHeight={calendarConfig.weekView.headerHeight}
              />
              {masters.map((master, masterIndex) => (
                <View
                  key={master.id}
                  className={
                    masterIndex === masters.length - 1
                      ? 'flex-row'
                      : 'flex-row border-b border-gray-200'
                  }
                  style={{ height: calendarConfig.weekView.masterRowHeight }}
                >
                  {weekDays.map((day, idx) => {
                    const dateKey = calendarUtils.toDateKeyLocal(day);
                    const cellAppointments = appointments.filter(
                      (a) => a.masterId === master.id && a.date === dateKey,
                    );
                    const isLastDay = idx === weekDays.length - 1;
                    return (
                      <View
                        key={`${master.id}-${idx}`}
                        style={{ width: calendarConfig.weekView.dayWidth }}
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
          </ScrollView>
        </View>
      )}
    </View>
  );
};
