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


type Props<T extends FieldValues> = TextInputProps & {
  accessoryRight?: React.ReactNode;
  onAccessoryRightPress?: () => void;
  containerStyle?: ViewStyle;
  error?: string;
  style?: StyleProp<TextStyle>;
  name: Path<T>;
  control: Control<T>;
}

export default function FormTextInput<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    control,
    accessoryRight,
    onAccessoryRightPress,
    containerStyle,
    style,
    error,
    ...rest
  } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError, style]}
          placeholderTextColor='#94A3B8'
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
    backgroundColor: '#FFFFFF',
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
