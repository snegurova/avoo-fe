import { Text, View, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { Layout } from '../shared/Layout';
import LoginForm from '../components/LoginForm';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import Spacer from '../shared/Spacer/Spacer';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Layout centerContent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='w-full'>
          <Text className='text-3xl font-bold text-center'>AVOO App</Text>
          <Text className='text-lg text-slate-500 text-center mb-12'>
            Sign in to your AVOO account
          </Text>

          <LoginForm />
          <Spacer size='xl' />
          <View className='flex-row justify-between items-center '>
            <Pressable
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'RegisterScreen' }],
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
                  routes: [{ name: 'ForgotPasswordScreen' }],
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
          <Spacer size='xl' />
          <Pressable
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Storybook' }],
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
