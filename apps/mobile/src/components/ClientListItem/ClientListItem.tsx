import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

import { Avatar } from '@/shared/Avatar/Avatar';

type Props = {
  client: CustomerInfoResponse;
  onPress: (client: CustomerInfoResponse) => void;
};

export const ClientListItem = (props: Props) => {
  const { client, onPress } = props;
  const displayName = client.name || 'No name';
  const formattedLastVisit = timeUtils.formatLastVisitDate(client.lastVisit) ?? '—';

  return (
    <Pressable
      className='flex-row items-start bg-white rounded-md border border-gray-200 px-4 py-3 mb-3'
      onPress={() => onPress(client)}
    >
      <Avatar backgroundColor={colors.primary[100]} size={44} uri={undefined} name={displayName} />
      <View className='flex-1 ml-3'>
        <Text variant='titleSmall' style={{ color: colors.gray[900] }}>
          {displayName}
        </Text>
        {client.email && (
          <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
            {client.email}
          </Text>
        )}
        {client.phone && (
          <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
            {client.phone}
          </Text>
        )}
        <View className='h-px bg-primary-100 my-2' />
        <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
          last visit {formattedLastVisit}
        </Text>
      </View>
    </Pressable>
  );
};
