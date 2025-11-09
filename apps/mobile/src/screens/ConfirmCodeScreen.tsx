import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import formatHooks from 'packages/hooks/src/formatHooks';
import VerificationInput from '../components/VerificationInput';
import { Layout } from '../shared/Layout';
import Button from '../shared/Button/Button';
import Spacer from '../shared/Spacer/Spacer';

export default function ConfirmCodeScreen() {
  const { email } = useRoute<RouteProp<RootStackParamList, 'ConfirmCodeScreen'>>().params;

  const maskedEmail = formatHooks.useMaskEmail(email || '');

  return (
    <Layout centerContent={true}>
      <View className='items-center'>
        <Text className='text-3xl font-bold text-center mb-4'>Verify your email address</Text>
        <Text className='text-sm text-gray-500 text-center mb-8'>
          We’ve sent a 6-digit verification code to your email {maskedEmail}
        </Text>

        <VerificationInput onCodeComplete={() => {}} />
        <Spacer size='xl' />

        <TouchableOpacity onPress={() => {}}>
          <Text className='text-sm text-blue-500 text-center'>Resend code</Text>
        </TouchableOpacity>
        <Spacer size='xl' />
        <Button title='Verify' onPress={() => {}} />
      </View>
    </Layout>
  );
}
