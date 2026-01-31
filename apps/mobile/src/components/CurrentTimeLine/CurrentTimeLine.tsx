import { View } from 'react-native';
import { calendarConfig } from '../CalendarSection/calendarConfig';

export const CurrentTimeLine = () => {
  const { hours, slotHeight } = calendarConfig.timeline;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const top = (currentMinutes / 60) * slotHeight;
  const totalHeight = hours.length * slotHeight;

  if (top < 0 || top > totalHeight) return null;

  return (
    <View
      className="absolute left-0 right-0 z-10 "
      style={{ top }}
      pointerEvents="none"
    >
      <View
        className="absolute left-0 right-0, h-2 bg-red-600"
      />
    </View>
  );
};
