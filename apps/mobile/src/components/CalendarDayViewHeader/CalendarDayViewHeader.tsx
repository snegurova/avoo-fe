import { View } from 'react-native';

import CalendarMaster from '../CalendarMaster/CalendarMaster';
import { calendarConfig } from '../CalendarSection/calendarConfig';

import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';

type Props = {
  masters: ShortMasterInfo[];
  contentWidth: number;
  colWidth: number;
};

export const CalendarDayViewHeader = (props: Props) => {
  const { masters, contentWidth, colWidth } = props;
  return (
    <View className='flex-row' style={{ width: contentWidth }}>
      {masters.map((master, index) => {
        const isLast = index === masters.length - 1;
        return (
          <View
            key={master.id}
            style={{ width: colWidth }}
            className={isLast ? 'relative' : 'border-r border-gray-200 relative'}
          >
            <CalendarMaster master={master} headerHeight={calendarConfig.dayView.headerHeight} />
          </View>
        );
      })}
    </View>
  );
};
