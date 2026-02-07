import { View, Text, Pressable, TextInput } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { phoneHooks, utils } from '@avoo/hooks';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { PhoneBottomSheet } from '@/shared/PhoneBottomSheet/PhoneBottomSheet';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  error?: string;
};

export function FormPhoneField<T extends FieldValues>(props: Props<T>) {
  const { name, control, label = 'Phone', placeholder = '066-66-78-890', error } = props;

  const { field } = useController({
    control,
    name,
  });

  const { countryCode, phoneNumber, setCountryCode, setPhoneNumber, maxNationalLength } =
    phoneHooks.usePhoneField(field);

  const {
    value: sheetVisible,
    enable: openSheet,
    disable: closeSheet,
  } = utils.useBooleanState(false);

  return (
    <View className='mb-4'>
      <Text className='mb-2 text-base text-black'>{label}</Text>
      <View className='flex-row gap-3'>
        <Pressable
          onPress={openSheet}
          className='flex-row items-center justify-between  px-4 bg-white border border-gray-200 rounded-lg min-w-[84px]'
        >
          <Text className='text-base text-black'>{countryCode || '+38'}</Text>
          <MaterialIcons name='keyboard-arrow-down' size={24} color={colors.gray[500]} />
        </Pressable>
        <TextInput
          className='flex-1 py-4 px-4 text-base text-black bg-white border border-gray-200 rounded-lg'
          placeholder={placeholder}
          placeholderTextColor='#94A3B8'
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onBlur={field.onBlur}
          keyboardType='phone-pad'
          maxLength={maxNationalLength}
        />
      </View>
      {error ? <Text className='text-red-500 text-xs mt-1 ml-1'>{error}</Text> : null}
      <PhoneBottomSheet
        visible={sheetVisible}
        onClose={closeSheet}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
      />
    </View>
  );
}

FormPhoneField.displayName = 'FormPhoneField';
