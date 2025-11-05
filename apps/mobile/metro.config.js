// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const { withNativeWind } = require('nativewind/metro');

// Объединяем: сначала Storybook, потом NativeWind
module.exports = withNativeWind(
  withStorybook(config),
  { input: './global.css' }
);
