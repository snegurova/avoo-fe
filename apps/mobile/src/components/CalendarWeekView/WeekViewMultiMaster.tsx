import { useState } from 'react';
import { View } from 'react-native';

import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';

import { Appointment } from '@/hooks/calendarHooks';
import { calendarUtils } from '@/utils/calendarUtils';

import CalendarOrder, { CALENDAR_ORDER_VARIANT } from '../CalendarOrder/CalendarOrder';
import { CalendarOverflowLabel } from '../CalendarOverflowLabel/CalendarOverflowLabel';
import { calendarConfig } from '../CalendarSection/calendarConfig';
import { OrderBottomSheet } from '../OrderBottomSheet/OrderBottomSheet';
import { TimelineGridLayout } from '../TimelineGridLayout/TimelineGridLayout';
import { WeekViewHeader } from '../WeekViewHeader/WeekViewHeader';
import { WeekViewLeftColumn } from './WeekViewLeftColumn';

type Props = {
  masters: ShortMasterInfo[];
  appointments: Appointment[];
  weekDays: Date[];
};

export const WeekViewMultiMaster = ({ masters, appointments, weekDays }: Props) => {
  const { headerHeight, dayWidth, masterColumnWidth, masterRowHeight } = calendarConfig.weekView;
  const contentWidth = weekDays.length * dayWidth;
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  return (
    <>
      <OrderBottomSheet
        visible={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
      />
      <TimelineGridLayout
        headerHeight={headerHeight}
        stickyHeader={
          <WeekViewHeader weekDays={weekDays} dayWidth={dayWidth} headerHeight={headerHeight} />
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
                          onPress={() => setSelectedOrderId(parseInt(apt.id, 10))}
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
    </>
  );
};
