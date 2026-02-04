import Layout from '@/shared/Layout/Layout';
import { View } from 'react-native';

import { NotificationsSection } from '@/components/NotificationsSection/NotificationSection';
import { AppointmentsSection } from '@/components/AppointmentsSection/AppointmentsSection';
import { CalendarSection } from '@/components/CalendarSection/CalendarSection';


export const HomeScreen = () => {
  return (
    <Layout hasBottomTab={true}>
       <View className='gap-8'>
        <NotificationsSection />
              <AppointmentsSection />
              <CalendarSection />
      </View>
    </Layout>
  );
};

export default HomeScreen;
