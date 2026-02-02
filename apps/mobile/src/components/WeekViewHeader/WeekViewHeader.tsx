import { View } from 'react-native';
import { WeekViewHeaderCell } from '../WeekViewHeaderCell/WeekViewHeaderCell';

type Props = {
  weekDays: Date[];
  dayWidth: number;
  headerHeight: number;
};

export const WeekViewHeader = (props: Props) => {
  const { weekDays, dayWidth, headerHeight } = props;
  return (
    <View className='flex-row border-b border-gray-200' style={{ height: headerHeight }}>
      {weekDays.map((day, i) => (
        <WeekViewHeaderCell
          key={i}
          day={day}
          dayIndex={i}
          dayWidth={dayWidth}
          headerHeight={headerHeight}
          isLastDay={i === weekDays.length - 1}
        />
      ))}
    </View>
  );
};
