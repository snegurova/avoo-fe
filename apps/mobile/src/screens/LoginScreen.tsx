import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Layout } from '../shared/Layout';
import LoginForm from '../components/LoginForm';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Layout centerContent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>AVOO App</Text>
          <Text style={styles.subtitle}>Sign in to your AVOO account</Text>

          <LoginForm />
          <View style={styles.signUpContainer}>
            <Text style={styles.navigateToSignIn}>No account?</Text>
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
              <Text style={styles.signInLink}>Sign up</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Storybook' }],
              })
            }
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.signInLink}>Open Storybook</Text>
          </Pressable>
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
  signInLink: {
    fontSize: 16,
    color: '#2563EB',
    textDecorationLine: 'underline',
    padding: 4,
  },
});
