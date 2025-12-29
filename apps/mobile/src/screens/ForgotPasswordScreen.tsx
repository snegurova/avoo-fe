import { Text, View, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import  Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

type Props = RootStackScreenProps<RootScreens.ForgotPasswordScreen>;

export default function ForgotPasswordScreen(props: Props) {
  const { navigation } = props;

  return (
    <Layout centerContent={true} isHeaderHidden={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full'>
          <Text className='text-3xl font-bold text-center mb-2'>Forgot Password</Text>
          <Text className='text-lg text-slate-500 text-center mb-12'>
            Enter your email to reset your password
          </Text>

          <ForgotPasswordForm />
          <View className='mt-6' />
          <View className='flex-row justify-between items-center'>
            <Pressable
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: RootScreens.LoginScreen }],
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
