import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Layout } from '../shared/Layout';
import RegistrationForm from '../components/RegistrationForm';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Layout style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>AVOO App</Text>
          <Text style={styles.subtitle}>Create a professional account</Text>
          <Text style={styles.subtitle}>Create an account or login in your busines</Text>

          <RegistrationForm />

          <View style={styles.signUpContainer}>
            <Text style={styles.navigateToSignIn}>Having account?</Text>
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
              <Text style={styles.signInLink}>Log in</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.copyright}>© 2025 Avoo</Text>
            <Text style={styles.privacyLink}>Privacy Policy</Text>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: '#64748B',
  },
  privacyLink: {
    fontSize: 14,
    color: '#2563EB',
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
