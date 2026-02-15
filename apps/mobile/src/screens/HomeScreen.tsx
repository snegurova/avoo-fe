import Layout from '@/shared/Layout/Layout';
import { View } from 'react-native';

import { NotificationsSection } from '@/components/NotificationsSection/NotificationSection';
import { AppointmentsSection } from '@/components/AppointmentsSection/AppointmentsSection';
import { CalendarWidget } from '@/components/CalendarWidget/CalendarWidget';

export const HomeScreen = () => {
  return (
    <Layout hasBottomTab={true}>
      <View className='gap-8'>
        <NotificationsSection />
        <AppointmentsSection />
        <CalendarWidget />
      </View>
    </Layout>
  );
};

export default HomeScreen;
