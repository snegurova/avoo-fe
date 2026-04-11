import { Text, View } from 'react-native';

import { Order } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

import { Avatar } from '@/shared/Avatar/Avatar';

type Props = {
  order: Order;
};

export const ClientOrderCard = (props: Props) => {
  const { order } = props;

  const orderDate = new Date(order.date);
  const invalid = Number.isNaN(orderDate.getTime());
  const dateDay = invalid ? '--' : orderDate.toLocaleDateString('en-US', { day: '2-digit' });
  const dateMonth = invalid ? '--' : orderDate.toLocaleDateString('en-US', { month: 'short' });
  const time = timeUtils.getTime(String(order.date));
  const title = order.service?.name ?? order.combination?.name ?? order.name ?? 'Booking';
  const duration = timeUtils.getHumanDuration(order.duration);
  const masterName = order.master?.name ?? 'Any master';
  const price = `${order.price} Euro`;
  const note = typeof order.notes === 'string' ? order.notes : undefined;

  return (
    <View className='border border-gray-200 rounded-xl px-4 py-3 mb-2'>
      <View className='flex-row gap-3'>
        <View className='items-center' style={{ width: 44 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 19,
              letterSpacing: 0.64,
              color: '#141A23',
              textAlign: 'center',
            }}
          >
            {dateDay}
            {'\n'}
            {dateMonth}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontWeight: '400',
              letterSpacing: 0.48,
              color: '#141A23',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            {time}
          </Text>
        </View>
        <View className='flex-1'>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 14,
              letterSpacing: 0.56,
              color: '#141A23',
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <View className='flex-row items-center flex-wrap gap-x-2 gap-y-1'>
            <Text className='text-xs text-gray-500'>{duration}</Text>
            <Text className='text-xs text-gray-400'>|</Text>
            <View className='flex-row items-center gap-1'>
              <Avatar
                size={16}
                name={masterName}
                backgroundColor={colors.primary[200]}
                textStyle={{ fontSize: 10, lineHeight: 12 }}
              />
              <Text className='text-xs text-gray-500'>{masterName}</Text>
            </View>
            <Text className='text-xs text-gray-400'>|</Text>
            <Text className='text-xs text-gray-500'>{price}</Text>
          </View>
          {note && <Text className='text-xs text-gray-500 mt-2'>{note}</Text>}
        </View>
      </View>
    </View>
  );
};
