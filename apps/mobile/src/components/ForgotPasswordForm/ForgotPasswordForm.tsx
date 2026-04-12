import { Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { colors } from '@avoo/design-tokens';
import { authHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import Button from '@/shared/Button/Button';
import FormTextInput from '@/shared/FormTextInput';
import { RootScreens } from '@/types/navigation';

const getLabelStyle = (hasError: boolean) => ({
  fontFamily: 'Roboto-Medium',
  fontSize: 14,
  color: hasError ? colors.red['500'] : colors.gray['900'],
});

export default function ForgotPasswordForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const navigation = useNavigation();

  const { sendCodeHandler } = authHooks.useSendCode({
    onSuccess: (email: string) => {
      navigation.navigate(RootScreens.ConfirmCodeScreen, {
        email,
      });
    },
  });

  const { control, handleSubmit, errors } = authHooks.useForgotPasswordForm({
    sendCodeHandler,
  });

  return (
    <View className='w-full' style={{ gap: 24 }}>
      <View style={{ gap: 4 }}>
        <Text style={getLabelStyle(!!errors.email)}>Email address *</Text>
        <FormTextInput
          name='email'
          control={control}
          placeholder='Email'
          error={errors.email?.message}
          hideErrorText
          inputContainerStyle={{ minHeight: 44, borderRadius: 8 }}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          placeholderTextColor='#4D5560'
          style={{ fontSize: 14, fontFamily: 'Roboto-Regular' }}
        />
      </View>
      <Button
        onPress={handleSubmit}
        title='Send Code'
        loading={isPending}
        disabled={isPending}
        buttonColor={colors.gray['900']}
        textColor={colors.white}
        style={{ borderRadius: 8, height: 44 }}
      />
    </View>
  );
}
