import { Text, View, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { Layout } from '@/shared/Layout';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Layout centerContent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full'>
          <Text className='text-3xl font-bold text-center mb-2'>Forgot Password</Text>
          <Text className='text-lg text-slate-500 text-center mb-12'>
            Enter your email to reset your password
          </Text>

          <ForgotPasswordForm />
          <View className='mt-6'/>
          <View className='flex-row justify-between items-center'>
            <Pressable
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'LoginScreen' }],
                })
              }
              accessibilityRole='button'
              accessibilityLabel='Sign up for a new account'
              accessibilityHint='Navigates to registration screen'
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className='text-blue-500'>Back to login</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
}
