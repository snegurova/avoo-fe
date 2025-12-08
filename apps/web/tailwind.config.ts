import type { Config } from 'tailwindcss';
import { colors, breakpoints, spacing, radius, typography } from '@avoo/design-tokens';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
    },
    spacing,
    borderRadius: radius,
    extend: {
      screens: {
        sm: `${breakpoints.sm}px`,
        md: `${breakpoints.md}px`,
        lg: `${breakpoints.lg}px`,
        xl: `${breakpoints.xl}px`,
        '2xl': `${breakpoints['2xl']}px`,
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
      },
    },
  },
  plugins: [],
};
export default config;
