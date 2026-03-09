import { View } from 'react-native';

import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { WEEK_DAYS } from '@avoo/constants';

import { Appointment } from '@/hooks/calendarHooks';

import { WeekViewMultiMaster } from './WeekViewMultiMaster';
import { WeekViewSoloMaster } from './WeekViewSoloMaster';

type Props = {
  masters: ShortMasterInfo[];
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

  return (
    <View className='flex-1'>
      {isSingleMaster ? (
        <WeekViewSoloMaster masters={masters} appointments={appointments} weekDays={weekDays} />
      ) : (
        <WeekViewMultiMaster masters={masters} appointments={appointments} weekDays={weekDays} />
      )}
    </View>
  );
};
