import { Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { colors } from '@avoo/design-tokens';
import { authHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import SixCodeInput from '@/components/SixCodeInput/SixCodeInput';
import Button from '@/shared/Button/Button';
import { RootScreens } from '@/types/navigation';

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
    <View style={{ gap: 24 }}>
      <SixCodeInput control={control} name='code' />
      {errors.code && (
        <Text className='text-red-500 text-center text-sm'>{errors.code.message}</Text>
      )}
      <Button
        onPress={handleSubmit}
        title='Verify'
        loading={isPending}
        disabled={isPending}
        buttonColor={colors.gray['900']}
        textColor={colors.white}
        style={{ borderRadius: 8, height: 44 }}
      />
    </View>
  );
}
