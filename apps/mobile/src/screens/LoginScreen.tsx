import { Keyboard, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';

import LoginForm from '@/components/LoginForm/LoginForm';
import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.LoginScreen>;

export default function LoginScreen(props: Props) {
  const { navigation } = props;

  return (
    <Layout
      isHeaderHidden={true}
      isScrollableDisabled={true}
      style={{ backgroundColor: '#ffffff' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full flex-1 pt-5'>
          <Text className='text-3xl font-semibold text-gray-600'>AVOO</Text>

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              className='text-xl font-medium text-gray-900 text-center'
              style={{ lineHeight: 30, letterSpacing: 0.8 }}
            >
              Log In
            </Text>
            <View style={{ marginTop: 24 }} />
            <Text
              className='text-sm font-regular text-gray-900 text-center'
              style={{ lineHeight: 21 }}
            >
              Access your dashboard and manage your business.
            </Text>
            <View style={{ marginTop: 56 }} />

            <LoginForm />
            <View style={{ marginTop: 56 }} />
            <View className='flex-row justify-between items-center'>
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
                <Text
                  className='text-md font-regular text-gray-700'
                  style={{ lineHeight: 24, letterSpacing: 0.64 }}
                >
                  Create an account
                </Text>
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
                <Text
                  className='text-md font-regular text-gray-700'
                  style={{ lineHeight: 24, letterSpacing: 0.64 }}
                >
                  Reset Password
                </Text>
              </Pressable>
            </View>
          </View>
          <View className='flex-row justify-between items-center' style={{ paddingBottom: 20 }}>
            <Text className='text-xs font-regular text-gray-600' style={{ lineHeight: 18 }}>
              © 2026 Avoo. All rights reserved.
            </Text>
            <Text
              style={{ fontFamily: 'Roboto-Bold', fontSize: 14, lineHeight: 21, color: '#5D3774' }}
            >
              Privacy Policy
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
}
