import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Service } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

type Props = {
  service: Service;
  onPress?: (service: Service) => void;
};

export const ServiceListItem = (props: Props) => {
  const { service, onPress } = props;

  return (
    <Pressable
      className='flex-row items-stretch rounded-md border border-gray-200 overflow-hidden mb-2'
      style={{ backgroundColor: service.isActive ? colors.white : colors.gray[100] }}
      onPress={() => onPress?.(service)}
    >
      <View
        className='w-2'
        style={{ backgroundColor: service.isActive ? colors.primary[200] : colors.gray[300] }}
      />
      <View className='flex-1 flex-row justify-between items-center px-4 py-3'>
        <View className='flex-1 mr-4'>
          <Text variant='titleSmall' className='mb-2' style={{ color: colors.gray[900] }}>
            {service.name}
          </Text>
          <Text variant='bodyMedium' style={{ color: colors.gray[900] }}>
            {timeUtils.getHumanDuration(service.durationMinutes)}
          </Text>
        </View>
        <Text variant='bodyLarge' style={{ color: colors.gray[900] }}>
          €{service.price}
        </Text>
      </View>
    </Pressable>
  );
};
