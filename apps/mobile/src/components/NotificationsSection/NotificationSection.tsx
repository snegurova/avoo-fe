import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { NotificationItem } from '../NotificationItem/NotificationItem';
import { ActionPillButton } from '@/shared/ActionPillButton/ActionPillButton';

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
          <NotificationItem key={notification.id} notification={notification} onPress={() => {}} />
        ))}
      </View>
      <ActionPillButton label='See all' className='mt-5' />
    </View>
  );
};
