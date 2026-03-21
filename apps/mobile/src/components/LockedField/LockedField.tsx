import { Pressable, Text } from 'react-native';

import { colors } from '@avoo/design-tokens';

import { MaterialIcons } from '@/shared/icons';

type Props = {
  value: string;
  onPress?: () => void;
  disabled?: boolean;
  error?: boolean;
  isPlaceholder?: boolean;
};

export const LockedField = (props: Props) => {
  const { value, onPress, disabled, error, isPlaceholder } = props;
  return (
    <Pressable
      className='rounded-lg border bg-white px-4 py-4 flex-row items-center justify-between'
      style={{ borderColor: error ? colors.red[500] : colors.gray[200] }}
      onPress={onPress}
      disabled={disabled || !onPress}
    >
      <Text
        className='text-base flex-1 mr-2'
        style={{ color: isPlaceholder ? colors.gray[400] : colors.gray[900] }}
        numberOfLines={1}
      >
        {value}
      </Text>
      {disabled && <MaterialIcons name='lock' size={18} color={colors.gray[400]} />}
      {!disabled && onPress && (
        <MaterialIcons name='expand-more' size={20} color={colors.gray[400]} />
      )}
    </Pressable>
  );
};
