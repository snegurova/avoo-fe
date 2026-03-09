import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm';
import Layout from '@/shared/Layout/Layout';

export default function ResetPasswordScreen() {
  return (
    <Layout centerContent={true} isHeaderHidden={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full'>
          <Text className='text-3xl font-bold text-center mb-4'>Reset Password</Text>
          <ResetPasswordForm />
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
}
