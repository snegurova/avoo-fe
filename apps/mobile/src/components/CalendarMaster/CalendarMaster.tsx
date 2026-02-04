import { View } from 'react-native';
import { Avatar } from '@/shared/Avatar/Avatar';
import { Master } from '../CalendarSection/CalendarSection';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';

type Props = {
  master: Master;
  headerHeight: number;
  borderBottom?: boolean;
};

export default function CalendarMaster(props: Props) {
  const { master, headerHeight, borderBottom = true } = props;
  const words = master.name.split(' ');
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ') || ' ';

  return (
    <View
      className={
        borderBottom
          ? 'items-center justify-center border-b border-gray-200'
          : 'items-center justify-center'
      }
      style={{ height: headerHeight }}
    >
      <Avatar name={master.initial} size={32} backgroundColor={colors.primary[400]} />
      <View className='mt-1 items-center' style={{ minHeight: 32 }}>
        <Text variant='bodySmall' style={{ textAlign: 'center' }}>
          {firstLine}
        </Text>
        <Text variant='bodySmall' style={{ textAlign: 'center' }}>
          {secondLine}
        </Text>
      </View>
    </View>
  );
}
