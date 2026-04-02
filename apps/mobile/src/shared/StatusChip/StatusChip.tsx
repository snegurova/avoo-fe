import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { OrderStatusEnum } from '@avoo/axios/types/apiEnums';
import { colors } from '@avoo/design-tokens';

export const STATUS_COLORS: Record<string, string> = {
  [OrderStatusEnum.PENDING]: colors.orange[500],
  [OrderStatusEnum.CONFIRMED]: colors.blue[700],
  [OrderStatusEnum.COMPLETED]: colors.purple[700],
  [OrderStatusEnum.EXPIRED]: colors.red[800],
  [OrderStatusEnum.CANCELED]: colors.red[800],
};

type StatusChipProps = {
  status?: string;
  color?: string;
};

const getStatusText = (status?: string) => {
  if (!status) return 'Unknown';

  if (status === OrderStatusEnum.CANCELED) return 'Canceled';
  if (status === OrderStatusEnum.PENDING) return 'Pending';
  if (status === OrderStatusEnum.CONFIRMED) return 'Confirmed';
  if (status === OrderStatusEnum.COMPLETED) return 'Completed';
  if (status === OrderStatusEnum.EXPIRED) return 'Out of schedule';
  return 'Unknown';
};

export const StatusChip = ({ status, color }: StatusChipProps) => {
  const backgroundColor = color ?? (status ? STATUS_COLORS[status] : undefined) ?? colors.gray[400];
  return (
    <View className='px-3 py-1 rounded-full' style={{ backgroundColor }}>
      <Text variant='bodySmall' style={{ color: colors.white }}>
        {getStatusText(status)}
      </Text>
    </View>
  );
};
