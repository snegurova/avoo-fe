'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import type {} from '@mui/x-date-pickers/themeAugmentation';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  colorSchemes: { light: true, dark: false },
  cssVariables: true,
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      light: '#F8F6FC',
      main: '#E8DEEE',
      dark: '#BB94CE',
    },
  },
  components: {
    MuiDatePicker: {
      defaultProps: {},
    },
  },
});

export default theme;
