import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootScreens } from '@/types/navigation';

import { authHooks } from '@avoo/hooks';
import { useApiStore } from '@avoo/store';

import FormTextInput from '@/shared/FormTextInput';
import Button from '@/shared/Button/Button';

export default function ForgotPasswordForm() {
  const isPending = useApiStore((state) => state.isPending);

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
    <View className='w-full gap-4'>
      <FormTextInput
        name='email'
        control={control}
        placeholder='Email'
        error={errors.email?.message}
        keyboardType='email-address'
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Button onPress={handleSubmit} title='Send Code' loading={isPending} disabled={isPending} />
    </View>
  );
}
