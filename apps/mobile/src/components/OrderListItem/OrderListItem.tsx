import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Order } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

import { Avatar } from '@/shared/Avatar/Avatar';
import { StatusChip } from '@/shared/StatusChip/StatusChip';

type Props = {
  order: Order;
  onPress: (id: number) => void;
};

export const OrderListItem = ({ order, onPress }: Props) => {
  const time = timeUtils.getTime(order.date);
  const date = timeUtils.formatShortDateLabel(new Date(order.date));
  const serviceName = order.service?.name ?? order.combination?.name ?? '—';
  const clientName = order.customer?.name ?? order.customer?.email ?? '—';
  const clientPhone = order.customer?.phone ?? '';
  const masterName = order.master?.name ?? '—';

  return (
    <Pressable
      onPress={() => onPress(order.id)}
      className='rounded-lg border border-gray-200 bg-white px-4 py-3 mb-2'
    >
      <View className='flex-row items-center justify-between mb-2'>
        <Text variant='labelMedium' style={{ color: colors.gray[600] }}>
          {time} · {date}
        </Text>
        <StatusChip status={order.status} />
      </View>
      <Text variant='labelLarge' style={{ color: colors.gray[900], marginBottom: 8 }}>
        {serviceName}
      </Text>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center' style={{ gap: 6 }}>
          <Avatar
            name={clientName}
            size={20}
            backgroundColor={colors.primary[100]}
            textStyle={{ fontSize: 10, lineHeight: 12 }}
          />
          <Text variant='bodySmall' style={{ color: colors.gray[700] }}>
            {clientName}
            {clientPhone ? `  ${clientPhone}` : ''}
          </Text>
        </View>
        <View className='flex-row items-center' style={{ gap: 6 }}>
          <Avatar
            uri={order.master?.avatarPreviewUrl}
            name={masterName}
            size={20}
            backgroundColor={colors.primary[300]}
            textStyle={{ fontSize: 10, lineHeight: 12 }}
          />
          <Text variant='bodySmall' style={{ color: colors.gray[700] }}>
            {masterName}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
