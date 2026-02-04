import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@/shared/icons';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { NotificationItem } from '../NotificationItem/NotificationItem';

const notifications = [
    {
      id: '1',
      time: '09:30',
      date: 'Fri 24 Oct',
      service: 'Manicure',
      clientPhone: '(066) 234-34-34',
      timeAgo: '24 mins ago',
      master: 'Master Pubert',
      isRead: false,
    },
    {
      id: '2',
      time: '09:30',
      date: 'Fri 24 Oct',
      service: 'Manicure',
      clientPhone: '(066) 234-34-34',
      timeAgo: '24 mins ago',
      master: 'Master Anna',
      isRead: true,
    },
  ];


export const NotificationsSection = () => {
 
  return (
    <View className='bg-white rounded-2xl p-4 border border-gray-200'>
      <Text variant='titleLarge' className='mb-4'>
        New notifications
      </Text>
      <View className='gap-3'>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => {}}
          />
        ))}
      </View>

      <Pressable
        className='flex-row items-center border border-gray-200 rounded-full py-2.5 px-3 gap-2 mt-5 self-end'
      >
        <Text variant='bodyMedium' style={{ color: colors.gray[600] }}>
          See all
        </Text>
        <MaterialIcons name='arrow-forward' size={14} />
      </Pressable>
    </View>
  );
};
