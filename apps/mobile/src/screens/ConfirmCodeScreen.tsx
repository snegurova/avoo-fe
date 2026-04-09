import { Pressable, Text, View } from 'react-native';

import { formatHooks } from '@avoo/hooks';
import { authHooks } from '@avoo/hooks';

import VerifyCodeForm from '@/components/VerifyCodeForm/VerifyCodeForm';
import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.ConfirmCodeScreen>;

export default function ConfirmCodeScreen(props: Props) {
  const { route } = props;

  const { email } = route.params;

  const maskedEmail = formatHooks.useMaskEmail(email);

  const { sendCodeHandler } = authHooks.useSendCode();

  return (
    <Layout
      isHeaderHidden={true}
      isScrollableDisabled={true}
      style={{ backgroundColor: '#ffffff' }}
    >
      <View className='w-full flex-1 pt-5'>
        <Text className='text-3xl font-semibold text-gray-600'>AVOO</Text>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            className='text-xl font-medium text-gray-900 text-center'
            style={{ lineHeight: 30, letterSpacing: 0.8 }}
          >
            Verify your email address
          </Text>
          <View style={{ marginTop: 24 }} />
          <Text
            className='text-sm font-regular text-gray-900 text-center'
            style={{ lineHeight: 21 }}
          >
            We've sent a 6-digit verification code to your email {maskedEmail}
          </Text>
          <View style={{ marginTop: 56 }} />

          <VerifyCodeForm email={email} />

          <View style={{ marginTop: 40 }} />
          <Pressable
            onPress={() => sendCodeHandler({ email })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              className='text-md font-regular text-gray-700 text-center'
              style={{ lineHeight: 24, letterSpacing: 0.64 }}
            >
              Resend code
            </Text>
          </Pressable>
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
    </Layout>
  );
}
