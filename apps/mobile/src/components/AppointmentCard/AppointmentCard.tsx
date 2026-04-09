import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@avoo/design-tokens';

import { Avatar } from '@/shared/Avatar/Avatar';
import { STATUS_COLORS, StatusChip } from '@/shared/StatusChip/StatusChip';

import { Appointment } from '../AppointmentsSection/AppointmentsSection';

type AppointmentCardProps = {
  appointment: Appointment;
};

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const statusColor =
    (appointment.status ? STATUS_COLORS[appointment.status] : undefined) ?? colors.gray[500];
  return (
    <View className='rounded-2xl border border-gray-200 p-4 flex-row'>
      <View className='w-1.5 rounded-full mr-3' style={{ backgroundColor: statusColor }} />

      <View className='flex-1'>
        <View className='flex-row items-center justify-between mb-1'>
          <View>
            <Text variant='titleMedium'>{appointment.dateLabel}</Text>
            <Text variant='bodyMedium' style={{ color: colors.gray[700] }}>
              {appointment.timeRange}
            </Text>
          </View>

          <StatusChip status={appointment.status} />
        </View>

        <View className='mt-3'>
          <Text variant='titleMedium'>{appointment.service}</Text>
          <View className='flex-row items-center mb-1 gap-2'>
            <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
              {appointment.duration}
            </Text>
            <Text variant='bodyMedium'>{appointment.price}</Text>
          </View>

          <View className='flex-row items-center'>
            <Avatar
              name={appointment.masterName}
              size={20}
              backgroundColor='#E5D9FF'
              textStyle={{ fontSize: 11, lineHeight: 12 }}
            />
            <Text variant='bodySmall' style={{ marginLeft: 4 }}>
              {appointment.masterName}
            </Text>
          </View>
        </View>

        <View className='mt-3'>
          <Text variant='titleMedium'>{appointment.clientName}</Text>
          <Text variant='bodySmall'>{appointment.clientPhone}</Text>
          <Text
            variant='bodySmall'
            numberOfLines={2}
            style={{ color: colors.gray[600], marginTop: 4 }}
          >
            {appointment.note}
          </Text>
        </View>
      </View>
    </View>
  );
};
