import { Text, View, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { Layout } from '@/shared/Layout';
import RegistrationForm from '@/components/RegistrationForm';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.RegisterScreen>;

export default function RegisterScreen(props: Props) {
  const { navigation } = props;

  return (
    <Layout centerContent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full'>
          <Text className='text-3xl font-bold text-center mb-2'>AVOO App</Text>
          <Text className='text-lg text-slate-500 text-center mb-12'>
            Create a professional account
          </Text>
          <Text className='text-lg text-slate-500 text-center mb-12'>
            Create an account or login in your busines
          </Text>

          <RegistrationForm />

          <View className='flex-row justify-center items-center mt-4 gap-1'>
            <Text className='text-base text-slate-500'>Having account?</Text>
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
              <Text className='text-base text-blue-600 underline p-1'>Log in</Text>
            </Pressable>
          </View>

          <View className='flex-row justify-between items-center'>
            <Text className='text-sm text-slate-500'>© 2025 Avoo</Text>
            <Text className='text-sm text-blue-600'>Privacy Policy</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
}
