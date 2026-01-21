import { View, Pressable } from 'react-native';
import { Avatar } from '@/shared/Avatar/Avatar';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';

type Notification = {
  id: string;
  time: string;
  date: string;
  service: string;
  clientPhone: string;
  timeAgo: string;
  master: string;
};

type Props = {
  notification: Notification;
  onPress: (id: string) => void;
};

export const NotificationItem = (props: Props) => {
  const { notification, onPress } = props;

  return (
    <Pressable
      onPress={() => onPress(notification.id)}
      className='rounded-md p-3 border border-gray-200 w-full flex-col justify-between items-start gap-2'
    >
      <View className='w-full flex-row items-center justify-between'>
        <Text variant='labelMedium'>
          {notification.time} {notification.date} | {notification.service}
        </Text>
        <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
          {notification.timeAgo}
        </Text>
      </View>
      <View className='w-full flex-row items-center justify-between'>
        <Text variant='bodySmall'>Client: {notification.clientPhone}</Text>
        <View className='flex-row items-center gap-1'>
          <Avatar
            name={notification.master}
            size={20}
            backgroundColor='#F1BA91'
            textStyle={{ fontSize: 12, lineHeight: 12 }}
          />
          <Text variant='bodySmall'>{notification.master}</Text>
        </View>
      </View>
    </Pressable>
  );
};
