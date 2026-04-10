import { Keyboard, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';

import RegistrationForm from '@/components/RegistrationForm/RegistrationForm';
import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.RegisterScreen>;

export default function RegisterScreen(props: Props) {
  const { navigation } = props;

  return (
    <Layout isHeaderHidden={true} style={{ backgroundColor: '#ffffff' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full'>
          <Text className='text-3xl font-semibold text-gray-600'>AVOO</Text>

          <View style={{ marginTop: 40 }} />
          <Text
            className='text-xl font-medium text-gray-900 text-center'
            style={{ lineHeight: 30, letterSpacing: 0.8 }}
          >
            Create a professional account
          </Text>
          <View style={{ marginTop: 12 }} />
          <Text
            className='text-sm font-regular text-gray-900 text-center'
            style={{ lineHeight: 21 }}
          >
            You are almost there! Create your new account by completing these details.
          </Text>
          <View style={{ marginTop: 32 }} />

          <RegistrationForm />

          <View style={{ marginTop: 40 }} />
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
              Having account?
            </Text>
            <Pressable
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: RootScreens.LoginScreen }],
                })
              }
              accessibilityRole='button'
              accessibilityLabel='Log in to existing account'
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

          <View style={{ marginTop: 32 }} />
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
