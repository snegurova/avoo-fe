import { View } from 'react-native';
import { calendarConfig } from '../CalendarSection/calendarConfig';

type Props = {
  columnKey: string; 
};

export const TimeGridLines = (props: Props) => {
  const { columnKey } = props;
  const { hours, slotHeight, quarterHeight } = calendarConfig.timeline;
  
  const hourBorderTops = hours.slice(1).map((_, i) => (i + 1) * slotHeight);
  const quarterBorderTops = hours.flatMap((_, hourIndex) =>
    [1, 2, 3].map((q) => hourIndex * slotHeight + q * quarterHeight),
  );

  return (
    <>
      {hourBorderTops.map((top, i) => (
        <View
          key={`hour-border-${i}-${columnKey}`}
          className='absolute left-0 right-0 border-b border-gray-300'
          style={{ top }}
          pointerEvents='none'
        />
      ))}
      {quarterBorderTops.map((top, i) => (
        <View
          key={`quarter-${i}-${columnKey}`}
          className='absolute left-0 right-0 border-b border-gray-200'
          style={{ top }}
          pointerEvents='none'
        />
      ))}
    </>
  );
};
