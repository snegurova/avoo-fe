import type { Config } from 'tailwindcss';
import { colors, spacing, radius, typography } from '@avoo/design-tokens';

const nativewindPreset = require('nativewind/preset');

const config: Config = {
  presets: [nativewindPreset],
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
    },
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    extend: {
      spacing,
      borderRadius: radius,
    },
  },
  plugins: [],
};

export default config;

