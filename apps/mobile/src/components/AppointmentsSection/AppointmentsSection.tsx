import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Order } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { orderHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import { Carousel } from '@/shared/Carousel/Carousel';
import { PillText } from '@/shared/PillText/PillText';

import { AppointmentCard } from '../AppointmentCard/AppointmentCard';

export type Appointment = {
  id: string;
  dateLabel: string;
  timeRange: string;
  service: string;
  duration: string;
  masterName: string;
  price: string;
  clientName: string;
  clientPhone: string;
  note: string;
  status?: string;
};

const mapOrderToAppointment = (order: Order): Appointment => {
  const endTime = timeUtils.getEndTime(order.date, order.duration);
  return {
    id: String(order.id),
    dateLabel: timeUtils.getHumanDate(order.date),
    timeRange: `${timeUtils.getTime(order.date)}–${endTime}`,
    service: order.service?.name ?? order.combination?.name ?? '—',
    duration: timeUtils.getHumanDuration(order.duration),
    masterName: order.master?.name ?? '—',
    price: `${order.price} Euro`,
    clientName: order.customer?.name ?? order.customer?.email ?? '—',
    clientPhone: order.customer?.phone ?? '',
    note: typeof order.notes === 'string' ? order.notes : '',
    status: order.status,
  };
};

export const AppointmentsSection = () => {
  const appointments = orderHooks.useUpcomingAppointmentsByMaster(20);

  if (!appointments) {
    return (
      <View className='bg-white rounded-2xl p-5 border border-gray-200 items-center py-8'>
        <ActivityIndicator color={colors.primary[700]} />
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View className='bg-white rounded-2xl p-5 border border-gray-200'>
        <View className='flex-row items-center justify-between mb-4'>
          <Text variant='titleLarge'>Next appointments</Text>
          <PillText>Starting next</PillText>
        </View>
        <View className='rounded-lg border border-gray-200 px-6 py-10 items-center justify-center'>
          <Text variant='titleMedium' style={{ textAlign: 'center', marginBottom: 8 }}>
            No upcoming appointments
          </Text>
          <Text variant='bodySmall' style={{ color: colors.gray[500], textAlign: 'center' }}>
            Upcoming appointments will appear here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className='bg-white rounded-2xl p-5 border border-gray-200'>
      <View className='flex-row items-center justify-between mb-4'>
        <Text variant='titleLarge'>Next appointments</Text>
        <PillText>Starting next</PillText>
      </View>

      <Carousel
        data={appointments.map(mapOrderToAppointment)}
        renderItem={(appointment) => <AppointmentCard appointment={appointment} />}
      />
    </View>
  );
};
