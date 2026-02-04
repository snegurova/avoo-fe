import { Pressable, Text, View } from 'react-native';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';
import { formatHooks } from '@avoo/hooks';
import  Layout from '@/shared/Layout/Layout';
import VerifyCodeForm from '@/components/VerifyCodeForm/VerifyCodeForm';
import { authHooks } from '@avoo/hooks';

type Props = RootStackScreenProps<RootScreens.ConfirmCodeScreen>;

export default function ConfirmCodeScreen(props: Props) {
  const { route } = props;

  const { email } = route.params;

  const maskedEmail = formatHooks.useMaskEmail(email);

  const { sendCodeHandler } = authHooks.useSendCode();

  return (
    <Layout centerContent={true} isHeaderHidden={true}>
      <View>
        <Text className='text-3xl font-bold text-center mb-4'>Verify your email address</Text>
        <Text className='text-sm text-gray-500 text-center mb-8'>
          We’ve sent a 6-digit verification code to your email {maskedEmail}
        </Text>
        <VerifyCodeForm email={email} />
        <View className='mt-6' />
        <Pressable
          onPress={() => {
            sendCodeHandler({
              email,
            });
          }}
        >
          <Text className='text-sm text-blue-500 text-center'>Resend code</Text>
        </Pressable>
      </View>
    </Layout>
  );
}
