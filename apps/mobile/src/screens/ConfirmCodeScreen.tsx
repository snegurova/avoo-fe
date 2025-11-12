import { Pressable, Text, View } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import formatHooks from 'packages/hooks/src/formatHooks';
import { Layout } from '../shared/Layout';
import VerifyCodeForm from '../components/VerifyCodeForm';
import Spacer from '../shared/Spacer/Spacer';
import { authHooks } from 'packages/hooks/src';

export default function ConfirmCodeScreen() {
  const { email } = useRoute<RouteProp<RootStackParamList, 'ConfirmCodeScreen'>>().params;

  const maskedEmail = formatHooks.useMaskEmail(email || '');

  const { sendCode } = authHooks.useSendCode();

  return (
    <Layout centerContent={true}>
      <View>
        <Text className='text-3xl font-bold text-center mb-4'>Verify your email address</Text>
        <Text className='text-sm text-gray-500 text-center mb-8'>
          We’ve sent a 6-digit verification code to your email {maskedEmail}
        </Text>
        <VerifyCodeForm />
        <Spacer size='xl' />
        <Pressable onPress={() => {
          sendCode({
            email,
          });
        }}>
          <Text className='text-sm text-blue-500 text-center'>Resend code</Text>
        </Pressable>
      </View>
    </Layout>
  );
}
