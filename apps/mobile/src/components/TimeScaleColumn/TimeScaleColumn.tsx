import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { calendarConfig } from '../CalendarSection/calendarConfig';

type Props = {
  headerHeight: number; 
};

export const TimeScaleColumn = ({ headerHeight }: Props) => {
  const { hours, slotHeight } = calendarConfig.timeline;
  return (
    <View className='w-16 border-r border-gray-200 relative'>
      <View style={{ height: headerHeight }} className='border-b border-gray-200' />
      <View style={{ height: hours.length * slotHeight }} className='relative'>
        {hours.map((hour) => (
          <View key={hour} style={{ height: slotHeight }} className='pr-2 items-end justify-center'>
            <Text variant='bodySmall' style={{ color: colors.gray[600] }}>
              {String(hour).padStart(2, '0')}:00
            </Text>
          </View>
        ))}
        {hours.slice(1).map((_, hourIndex) => (
          <View
            key={`time-hour-border-${hourIndex}`}
            className='absolute left-0 right-0 border-b border-gray-300'
            style={{
              top: (hourIndex + 1) * slotHeight,
            }}
            pointerEvents='none'
          />
        ))}
      </View>
    </View>
  );
};
