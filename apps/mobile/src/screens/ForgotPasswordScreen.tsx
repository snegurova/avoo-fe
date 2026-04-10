import { Keyboard, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';

import ForgotPasswordForm from '@/components/ForgotPasswordForm/ForgotPasswordForm';
import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.ForgotPasswordScreen>;

export default function ForgotPasswordScreen(props: Props) {
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
              Reset Password
            </Text>
            <View style={{ marginTop: 24 }} />
            <Text
              className='text-sm font-regular text-gray-900 text-center'
              style={{ lineHeight: 21 }}
            >
              Enter your email address and we'll send you a code to reset your password.
            </Text>
            <View style={{ marginTop: 56 }} />

            <ForgotPasswordForm />

            <View style={{ marginTop: 56 }} />
            <View className='flex-row justify-center items-center' style={{ gap: 4 }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  fontSize: 16,
                  lineHeight: 24,
                  letterSpacing: 0.64,
                  color: '#141A23',
                }}
              >
                Remember your password?
              </Text>
              <Pressable
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: RootScreens.LoginScreen }],
                  })
                }
                accessibilityRole='button'
                accessibilityLabel='Back to login'
                accessibilityHint='Navigates to login screen'
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto-Bold',
                    fontSize: 16,
                    lineHeight: 24,
                    letterSpacing: 0.64,
                    color: '#5D3774',
                    textDecorationLine: 'underline',
                  }}
                >
                  Log in
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
