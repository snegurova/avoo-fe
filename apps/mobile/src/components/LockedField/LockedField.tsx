import { Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';

import { LockIcon } from '@/icons/LockIcon';

type Props = { value: string };

export const LockedField = (props: Props) => {
  const { value } = props;
  return (
    <View className='rounded-lg border border-gray-200 bg-white px-4 py-4 flex-row items-center justify-between'>
      <Text className='text-base text-gray-900 flex-1 mr-2' numberOfLines={1}>
        {value}
      </Text>
      <LockIcon width={14} height={14} fill={colors.gray[500]} />
    </View>
  );
};
