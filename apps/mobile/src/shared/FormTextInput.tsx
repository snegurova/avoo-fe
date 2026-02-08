import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import {
  View,
  TextInput,
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
};

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
    <View className='w-full' style={containerStyle}>
      <View
        className={`flex-row items-center border rounded-lg bg-white ${error ? 'border-red-500' : 'border-gray-200'}`}
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
      {error && <Text className='text-red-500 text-xs mt-1 ml-1'>{error}</Text>}
    </View>
  );
}

FormTextInput.displayName = 'FormTextInput';
