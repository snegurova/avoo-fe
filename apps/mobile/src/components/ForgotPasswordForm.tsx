import { View } from 'react-native';
import FormTextInput from '../shared/FormTextInput';
import Button from '../shared/Button/Button';
import { authHooks } from '@avoo/hooks';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useApiStore } from 'packages/store/src/api.store';

export default function ForgotPasswordForm() {
  const isPending = useApiStore((state) => state.isPending);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  const { sendCodeHandler } = authHooks.useSendCode({
    onSuccess: (email: string) => {
      navigation.navigate('ConfirmCodeScreen', {
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
