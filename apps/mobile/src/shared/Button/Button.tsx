import { memo } from 'react';
import {
  Button as PaperButton,
  useTheme,
  type ButtonProps as PaperButtonProps,
} from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

export enum Variant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

type Props = {
  onPress: () => void;
  title: string;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
} & Omit<PaperButtonProps, 'onPress' | 'children' | 'mode' | 'buttonColor' | 'textColor' | 'style'>;

function Button(props: Props) {
  const {
    onPress,
    title,
    variant = Variant.PRIMARY,
    disabled = false,
    loading = false,
    style,
    ...rest
  } = props;

  const theme = useTheme();

  const getButtonConfig = () => {
    switch (variant) {
      case 'primary':
        return {
          mode: 'contained' as const,
          buttonColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        };
      case 'secondary':
        return {
          mode: 'contained' as const,
          buttonColor: theme.colors.secondary,
          textColor: theme.colors.onSecondary,
        };
      case 'tertiary':
        return {
          mode: 'outlined' as const,
          buttonColor: theme.colors.secondaryContainer,
          textColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
        };
      default:
        return {
          mode: 'contained' as const,
          buttonColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <PaperButton
      mode={buttonConfig.mode}
      buttonColor={buttonConfig.buttonColor}
      textColor={buttonConfig.textColor}
      onPress={onPress}
      disabled={disabled || loading}
      loading={loading}
      style={[style]}
      {...rest}
    >
      {title}
    </PaperButton>
  );
}

export default memo(Button);
