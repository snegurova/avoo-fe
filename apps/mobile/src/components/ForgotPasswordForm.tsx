import {  View } from 'react-native';
import FormTextInput from '../shared/FormTextInput';
import Button from '../shared/Button/Button';
import { authHooks } from '@avoo/hooks';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export default function ForgotPasswordForm() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { control, handleSubmit, errors, isPending } = authHooks.useForgotPasswordForm({
    onSuccess: (email: string) => {
      navigation.navigate('ConfirmCodeScreen', {
        email,
      });
    },
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

