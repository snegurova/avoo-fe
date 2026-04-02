import { Pressable, Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';

import { EditSquareIcon } from '@/icons';

type Props = {
  title: string;
  onEdit?: () => void;
};

export const SectionHeader = (props: Props) => {
  const { title, onEdit } = props;

  return (
    <View className='flex-row items-center justify-between mb-4'>
      <Text className='text-xl font-bold text-slate-900'>{title}</Text>
      {onEdit && (
        <Pressable className='w-11 h-11 items-center justify-center' onPress={onEdit}>
          <EditSquareIcon size={24} color={colors.gray[600]} />
        </Pressable>
      )}
    </View>
  );
};
