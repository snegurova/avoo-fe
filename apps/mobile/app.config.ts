import { ConfigContext, ExpoConfig } from 'expo/config';
import dotenv from 'dotenv';
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'AVOO Mobile',
  slug: 'avoo-mobile',
  scheme: process.env.APP_SCHEME ?? 'avoo',
  plugins: ['expo-dev-client', ['expo-splash-screen', { backgroundColor: '#FFFFFF' }]],
  ios: {
    bundleIdentifier: process.env.IOS_BUNDLE_ID ?? 'com.avoo.mobile',
  },
  android: {
    package: process.env.ANDROID_PACKAGE ?? 'com.avoo.mobile',
  },
  extra: {
    apiUrl: process.env.API_URL,
  },
});
