import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Props<T extends FieldValues> = TextInputProps & {
  accessoryRight?: React.ReactNode;
  onAccessoryRightPress?: () => void;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  error?: string;
  hideErrorText?: boolean;
  style?: StyleProp<TextStyle>;
  name: Path<T>;
  control: Control<T>;
};

export default function FormTextInput<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    control,
    accessoryRight,
    onAccessoryRightPress,
    containerStyle,
    inputContainerStyle,
    style,
    error,
    hideErrorText = false,
    ...rest
  } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <View className='w-full' style={containerStyle}>
      <View
        className={`flex-row items-center border rounded-lg bg-white ${error ? 'border-red-500' : 'border-gray-200'}`}
        style={inputContainerStyle}
      >
        <TextInput
          className='flex-1 text-base text-gray-900 p-4'
          placeholderTextColor='#94A3B8'
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          style={style}
          {...rest}
        />
        {accessoryRight && (
          <TouchableOpacity
            className='justify-center items-center pr-4'
            onPress={onAccessoryRightPress}
            disabled={!onAccessoryRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {accessoryRight}
          </TouchableOpacity>
        )}
      </View>
      {error && !hideErrorText && <Text className='text-red-500 text-xs mt-1 ml-1'>{error}</Text>}
    </View>
  );
}

FormTextInput.displayName = 'FormTextInput';
