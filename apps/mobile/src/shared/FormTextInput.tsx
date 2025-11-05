import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
  TextStyle,
  StyleProp,
  Text,
} from 'react-native';

/**
 * @property {React.ReactNode} accessoryRight - Icon component to display on the right side
 * @property {() => void} onAccessoryRightPress - Handler for right icon press (e.g., toggle password visibility)
 * @property {ViewStyle} containerStyle - Custom styles for the container wrapper
 * @property {string} error - Error message (changes border color to red)
 * @property {StyleProp<TextStyle>} style - Custom styles for the input itself
 * @property {Path<T>} name - Name of the input field
 * @property {Control<T>} control - Control object from react-hook-form
 */

interface Props<T extends FieldValues> extends TextInputProps {
  accessoryRight?: React.ReactNode;
  onAccessoryRightPress?: () => void;
  containerStyle?: ViewStyle;
  error?: string;
  style?: StyleProp<TextStyle>;
  name: Path<T>;
  control: Control<T>;
}

export const FormTextInput = <T extends FieldValues>(props: Props<T>) => {
  const { name, control, accessoryRight, onAccessoryRightPress, containerStyle, style, error, ...rest } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            style,
          ].filter(Boolean) as StyleProp<TextStyle>}
          placeholderTextColor="#94A3B8"
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          {...rest}
        />
        {accessoryRight && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onAccessoryRightPress}
            disabled={!onAccessoryRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {accessoryRight}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

FormTextInput.displayName = 'FormTextInput';


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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});