import { Text, View } from 'react-native';
import SixCodeInput from '@/components/SixCodeInput/SixCodeInput';
import Button from '@/shared/Button/Button';
import { authHooks } from '@avoo/hooks';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { useApiStore } from '@avoo/store';

export default function VerifyCodeForm() {
  const { email } = useRoute<RouteProp<RootStackParamList, 'ConfirmCodeScreen'>>().params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isPending = useApiStore((state) => state.isPending);


  const { control, handleSubmit, errors } = authHooks.useVerifyCodeForm({
    email: email || '',
    onSuccess: () => {
      navigation.navigate('ResetPasswordScreen');
    },
  });

  return (
    <View>
      <SixCodeInput control={control} name='code' />
      {errors.code && <Text className='text-red-500 text-center'>{errors.code.message}</Text>}
      <View className='mt-6'/>
      <Button onPress={handleSubmit} title='Verify' loading={isPending} disabled={isPending} />
    </View>
  );
}
