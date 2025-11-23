import { Text, View, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { Layout } from '@/shared/Layout';
import LoginForm from '@/components/LoginForm';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.LoginScreen>;

export default function LoginScreen(props: Props) {
  const { navigation } = props;

  return (
    <Layout centerContent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full'>
          <Text className='text-3xl font-bold text-center'>AVOO App</Text>
          <Text className='text-lg text-slate-500 text-center mb-12'>
            Sign in to your AVOO account
          </Text>

          <LoginForm />
          <View className='mt-6' />
          <View className='flex-row justify-between items-center '>
            <Pressable
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: RootScreens.RegisterScreen }],
                })
              }
              accessibilityRole='button'
              accessibilityLabel='Sign up for a new account'
              accessibilityHint='Navigates to registration screen'
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className='text-blue-500'>Create an account</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: RootScreens.ForgotPasswordScreen }],
                })
              }
              accessibilityRole='button'
              accessibilityLabel='Forgot password'
              accessibilityHint='Navigates to forgot password screen'
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className='text-blue-500'>Forgot password?</Text>
            </Pressable>
          </View>
          <View className='mt-6' />
          <Pressable
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: RootScreens.Storybook }],
              })
            }
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className='text-blue-500'>Open Storybook</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
}
