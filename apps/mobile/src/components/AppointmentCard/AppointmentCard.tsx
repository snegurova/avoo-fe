import { Avatar } from '@/shared/Avatar/Avatar';
import { StatusChip } from '@/shared/StatusChip/StatusChip';
import { colors } from '@avoo/design-tokens';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Appointment } from '../AppointmentsSection/AppointmentsSection';
import { OrderStatusEnum } from '@avoo/axios/types/apiEnums';

type AppointmentCardProps = {
  appointment: Appointment;
};

const getStatusColor = (status?: string) => {
  if (!status) return colors.gray[500];
  
  if (status === OrderStatusEnum.CANCELED) return colors.red[800];
  if (status === OrderStatusEnum.PENDING) return colors.orange[500];
  if (status === OrderStatusEnum.CONFIRMED) return colors.blue[700];
  if (status === OrderStatusEnum.COMPLETED) return colors.green[800];
  if (status === OrderStatusEnum.EXPIRED) return colors.gray[500];
  
  return colors.gray[500];
};

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const statusColor = getStatusColor(appointment.status);
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

          <StatusChip status={appointment.status} color={getStatusColor(appointment.status)} />
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
          <Text variant='titleMedium'>
            {appointment.clientName}
          </Text>
          <Text variant='bodySmall'>
            {appointment.clientPhone}
          </Text>
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
