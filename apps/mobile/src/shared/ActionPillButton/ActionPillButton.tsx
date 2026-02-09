import { Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { tv } from 'tailwind-variants';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { ObjectValues } from '@avoo/axios/types/apiEnums';

export const ACTION_PILL_SIZE = { SM: 'sm', MD: 'md' } as const;
export type ActionPillSizeType = ObjectValues<typeof ACTION_PILL_SIZE>;

const pillButton = tv({
  base: 'flex-row items-center border border-gray-200 rounded-full gap-2',
  variants: {
    size: {
      sm: 'py-1 px-4',
      md: 'py-2.5 px-3 mt-4 self-end',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: ActionPillSizeType;
  className?: string;
};

export function ActionPillButton(props: Props) {
  const { label, onPress, disabled, size = ACTION_PILL_SIZE.MD, className } = props;
  const isSm = size === ACTION_PILL_SIZE.SM;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${pillButton({ size })} ${className ?? ''}`.trim()}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      <Text variant={isSm ? 'bodySmall' : 'bodyMedium'} style={{ color: colors.gray[600] }}>
        {label}
      </Text>
      <MaterialIcons name='arrow-forward' size={14} />
    </Pressable>
  );
}
