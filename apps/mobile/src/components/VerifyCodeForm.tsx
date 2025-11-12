import { Text, View } from 'react-native';
import SixCodeInput from './SixCodeInput/SixCodeInput';
import Spacer from '../shared/Spacer/Spacer';
import Button from '../shared/Button/Button';
import { authHooks } from 'packages/hooks/src';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useApiStore } from 'packages/store/src/api.store';

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
      <Spacer size='xl' />
      <Button onPress={handleSubmit} title='Verify' loading={isPending} disabled={isPending} />
    </View>
  );
}
