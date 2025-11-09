import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Layout } from '../shared/Layout';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import Spacer from '../shared/Spacer/Spacer';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Layout centerContent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
        <View style={styles.wrapper}>
          <Text className='text-3xl font-bold text-center'>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to reset your password</Text>

          <ForgotPasswordForm />
          <Spacer size='xl' />
          <View className='flex-row justify-between items-center '>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 48,
  },
  wrapper: {
    width: '100%',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  navigateToSignIn: {
    fontSize: 16,
    color: '#64748B',
  },
});
