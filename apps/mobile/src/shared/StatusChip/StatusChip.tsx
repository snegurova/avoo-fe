import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { OrderStatusEnum, OrderStatusType } from '@avoo/axios/types/apiEnums';

type StatusChipProps = {
  status?: OrderStatusType;
  color?: string;
};


const getStatusText = (status?: OrderStatusType) => {
  if (!status) return 'Unknown';
  
  if (status === OrderStatusEnum.CANCELED) return 'Canceled';
  if (status === OrderStatusEnum.PENDING) return 'Pending';
  if (status === OrderStatusEnum.CONFIRMED) return 'Confirmed';
  if (status === OrderStatusEnum.COMPLETED) return 'Completed';
  if (status === OrderStatusEnum.EXPIRED) return 'Out of schedule';
  return 'Unknown';
};

export const StatusChip = ({ status, color }: StatusChipProps) => {
  return (
    <View className='px-3 py-1 rounded-full' style={{ backgroundColor: color }}>
      <Text variant='bodySmall' style={{ color: colors.white }}>
        {getStatusText(status)}
      </Text>
    </View>
  );
};

