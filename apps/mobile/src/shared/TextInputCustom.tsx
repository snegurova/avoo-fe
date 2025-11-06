import React, { memo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';

type Props = TextInputProps & {
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  error?: string;
  style?: StyleProp<TextStyle>;
}

const TextInputCustomComponent = React.forwardRef<TextInput | null, Props>((props: Props, ref) => {
  const { rightIcon, onRightIconPress, containerStyle, style, error, ...rest } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={[styles.input, error && styles.inputError, style]}
          placeholderTextColor='#94A3B8'
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

TextInputCustomComponent.displayName = 'TextInputCustom';

export default memo(TextInputCustomComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    padding: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
  },
});
