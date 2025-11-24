import { Text, View } from 'react-native';
import SixCodeInput from '@/components/SixCodeInput/SixCodeInput';
import Button from '@/shared/Button/Button';
import { authHooks } from '@avoo/hooks';
import { useNavigation } from '@react-navigation/native';
import { RootScreens } from '@/types/navigation';
import { useApiStatusStore } from '@avoo/store';

type Props = {
  email: string;
};

export default function VerifyCodeForm(props: Props) {
  const { email } = props;

  const navigation = useNavigation();

  const isPending = useApiStatusStore((state) => state.isPending);


  const { control, handleSubmit, errors } = authHooks.useVerifyCodeForm({
    email,
    onSuccess: () => {
      navigation.navigate(RootScreens.ResetPasswordScreen);
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
