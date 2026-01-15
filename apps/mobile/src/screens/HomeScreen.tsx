import { View } from 'react-native';
import Layout from '@/shared/Layout/Layout';
import { NotificationsSection } from '@/components/NotificationsSection/NotificationSection';
import { AppointmentsSection } from '@/components/AppointmentsSection/AppointmentsSection';

export const HomeScreen = () => {
  return (
    <Layout hasBottomTab={true}>
      <View className='gap-8'>
        <NotificationsSection />
        <AppointmentsSection />
      </View>
    </Layout>
  );
};

export default HomeScreen;
