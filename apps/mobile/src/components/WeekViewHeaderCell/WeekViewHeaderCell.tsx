import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { calendarUtils } from '@/utils/calendarUtils';
import { WEEK_DAYS } from '@avoo/constants';

export type Props = {
  day: Date;
  dayIndex: number;
  dayWidth: number;
  headerHeight: number;
  isLastDay?: boolean;
};

export const WeekViewHeaderCell = (props: Props) => {
  const { day, dayIndex, dayWidth, headerHeight, isLastDay } = props;
  const isToday = calendarUtils.isToday(day);
  return (
    <View
      style={{ width: dayWidth, height: headerHeight }}
      className={
        isLastDay
          ? 'items-center justify-center'
          : 'items-center justify-center border-r border-gray-200'
      }
    >
      <Text variant='labelSmall' style={{ color: colors.gray[600] }}>
        {WEEK_DAYS[dayIndex]}
      </Text>
      <View
        className='mt-1 h-7 w-7 items-center justify-center rounded-full'
        style={{ backgroundColor: isToday ? colors.primary[600] : 'transparent' }}
      >
        <Text variant='bodySmall' style={{ color: isToday ? colors.white : colors.gray[900] }}>
          {day.getDate()}
        </Text>
      </View>
    </View>
  );
};
