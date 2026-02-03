import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import type { TextStyle } from 'react-native';

type Props = {
  total: number;
  maxShown: number;
  style?: TextStyle;
};

export const CalendarOverflowLabel = (props: Props) => {
  const { total, maxShown, style } = props;
  if (total <= maxShown) return null;
  return (
    <Text variant="labelSmall" style={[{ color: colors.gray[500] }, style]}>
      +{total - maxShown} more
    </Text>
  );
};
