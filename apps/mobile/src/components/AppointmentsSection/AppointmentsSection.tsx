import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { AppointmentCard } from '../AppointmentCard/AppointmentCard';
import { Carousel } from '@/shared/Carousel/Carousel';

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
  status?: 'out_of_schedule' | 'normal';
};

const mockAppointments: Appointment[] = [
  {
    id: '1',
    dateLabel: 'Today, 12 Sep',
    timeRange: '09:15–10:15',
    service: 'Haircut',
    duration: '1h 30min',
    masterName: 'Master Anna',
    price: '65 Euro',
    clientName: 'Client Name',
    clientPhone: '0122-23-23-232',
    note: 'Lorem ipsum dolor sit amet consectetur. Turpis lorem lectus egestas quam integer. Ac urna…',
    status: 'out_of_schedule',
  },
  {
    id: '2',
    dateLabel: 'Today, 12 Sep',
    timeRange: '11:00–11:45',
    service: 'Manicure',
    duration: '45min',
    masterName: 'Master Pubert',
    price: '40 Euro',
    clientName: 'Maria',
    clientPhone: '066-234-34-34',
    note: 'Confirm the color palette before start.',
    status: 'normal',
  },
  {
    id: '3',
    dateLabel: 'Tomorrow, 13 Sep',
    timeRange: '08:30–09:30',
    service: 'Brow shaping',
    duration: '1h',
    masterName: 'Master Anna',
    price: '25 Euro',
    clientName: 'Olena',
    clientPhone: '050-101-01-01',
    note: 'Sensitive skin — use gentle wax.',
    status: 'normal',
  },
  {
    id: '4',
    dateLabel: 'Tomorrow, 13 Sep',
    timeRange: '12:15–13:15',
    service: 'Massage',
    duration: '1h',
    masterName: 'Master Igor',
    price: '70 Euro',
    clientName: 'Alex',
    clientPhone: '093-777-77-77',
    note: 'Focus on upper back/neck.',
    status: 'out_of_schedule',
  },
  {
    id: '5',
    dateLabel: 'Mon, 16 Sep',
    timeRange: '18:00–19:30',
    service: 'Hair coloring',
    duration: '1h 30min',
    masterName: 'Master Anna',
    price: '120 Euro',
    clientName: 'Katya',
    clientPhone: '098-222-22-22',
    note: 'Bring reference photo; prefers colder tones.',
    status: 'normal',
  },
];

export const AppointmentsSection = () => {
  return (
    <View
      className='bg-white rounded-2xl p-5 border border-gray-200'
    >
      <View className='flex-row items-center justify-between mb-4'>
        <Text variant='titleLarge'>Next appointments</Text>
        <View className='px-3 py-1 rounded-xl border border-gray-200'>
          <Text variant='bodySmall' style={{ color: colors.gray[700] }}>
            Starting next
          </Text>
        </View>
      </View>

      <Carousel
        data={mockAppointments}
        renderItem={(appointment) => <AppointmentCard appointment={appointment} />}
      />
    </View>
  );
};
