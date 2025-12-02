import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BB94CE',
        secondary: '#E8DEEE',
        light: '#F8F6FC',
      },
    },
  },
  plugins: [],
};
export default config;
