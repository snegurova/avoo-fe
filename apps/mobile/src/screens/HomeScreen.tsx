import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { calendarHooks, orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { AppointmentsSection } from '@/components/AppointmentsSection/AppointmentsSection';
import { CalendarWidget } from '@/components/CalendarWidget/CalendarWidget';
import { NotificationsSection } from '@/components/NotificationsSection/NotificationSection';
import Layout from '@/shared/Layout/Layout';

export const HomeScreen = () => {
  const [ready, setReady] = useState(false);
  const dateFrom = useMemo(() => new Date().toISOString(), []);
  const today = useMemo(() => timeUtils.formatDate(new Date()), []);

  const pendingOrders = orderHooks.useGetOrders({
    page: 1,
    limit: 1,
    status: OrderStatus.PENDING,
    dateFrom,
  });
  const { data: calendarData } = calendarHooks.useGetCalendar({
    rangeFromDate: today,
    rangeToDate: today,
  });

  const dataLoaded = pendingOrders !== null || calendarData !== undefined;

  useEffect(() => {
    if (dataLoaded && !ready) setReady(true);
  }, [dataLoaded]);

  if (!ready) {
    return (
      <Layout hasBottomTab>
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color={colors.primary[700]} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout hasBottomTab>
      <View className='gap-8 pb-4'>
        <NotificationsSection />
        <AppointmentsSection />
        <CalendarWidget />
      </View>
    </Layout>
  );
};

export default HomeScreen;
