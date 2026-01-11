'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { colors, radius, typography } from '@avoo/design-tokens';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  colorSchemes: { light: true, dark: false },
  cssVariables: true,
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontWeightRegular: Number(typography.fontWeight.regular),
    fontWeightMedium: Number(typography.fontWeight.medium),
    fontWeightBold: Number(typography.fontWeight.bold),
    h1: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1.1,
    },
    h2: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1.15,
    },
    h3: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
    h5: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
    h6: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },

    subtitle1: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
    subtitle2: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
    },

    body1: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.regular,
    },
    body2: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.regular,
    },

    button: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',
    },

    caption: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.regular,
    },

    overline: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'uppercase',
    },
  },
  palette: {
    primary: {
      main: colors.primary[500],
      light: colors.primary[100],
      dark: colors.primary[800],
    },
    secondary: {
      main: colors.black,
    },
    pending: {
      main: colors.orange[500],
      light: colors.orange[50],
      dark: colors.orange[700],
    },
    outOfSchedule: {
      main: colors.red[700],
      light: colors.red[50],
      dark: colors.red[700],
    },
    confirmed: {
      main: colors.blue[700],
      light: colors.blue[50],
      dark: colors.blue[700],
    },
    info: {
      main: colors.primary[100],
      light: colors.primary[100],
      dark: colors.primary[800],
    },
    text: {
      primary: colors.black,
      secondary: colors.gray[500],
      info: colors.primary[800],
      white: colors.white,
    },
    background: {
      default: colors.primary[50],
      paper: colors.white,
      info: colors.primary[100],
      pending: colors.orange[50],
      confirmed: colors.blue[50],
    },
  },
  shape: {
    borderRadius: radius.md,
    borderRadiusSm: radius.sm,
    borderRadiusMd: radius.md,
    borderRadiusLg: radius.lg,
    borderRadiusXl: radius.xl,
  },
  mixins: {
    menu: {
      itemHeight: 48,
      itemPaddingTop: 8,
      visibleItems: 4,
      partialVisibleItem: 0.5,
      width: 250,
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...(ownerState.color === 'pending' && {
            backgroundColor: theme.palette.pending.main,
            color: theme.palette.text.white,
          }),
          ...(ownerState.color === 'outOfSchedule' && {
            backgroundColor: theme.palette.outOfSchedule.main,
            color: theme.palette.text.white,
          }),
          padding: '4px 6px',
        }),

        label: {
          fontWeight: typography.fontWeight.medium,
        },
      },
    },
    MuiDatePicker: {
      defaultProps: {
        slotProps: {
          openPickerIcon: {
            className: 'fill-gray-800 w-4 h-4',
          },
          textField: {
            size: 'small',
            fullWidth: true,
          },
        },
      },
    },

    MuiTimePicker: {
      defaultProps: {
        slotProps: {
          textField: {
            size: 'small',
            fullWidth: true,
          },
        },
      },
    },

    MuiPickersTextField: {
      styleOverrides: {
        root: {
          '& .MuiPickersInputBase-root': {
            borderRadius: 0,
          },
          '& .MuiPickersSectionList-root': {
            padding: '8px 0',
            fontSize: typography.fontSize.sm,
            lineHeight: 1.15,
            color: 'var(--color-gray-800)',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& label + .MuiInputBase-root': {
            marginTop: '4px',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&::before': {
            borderBottom: 'none',
          },
          '&:hover:not(.Mui-disabled)::before': {
            borderBottom: 'none',
          },
          '&.Mui-focused::before': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: () => ({
          '& span': {
            fontSize: typography.fontSize.sm,
            color: 'var(--color-gray-800)',
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => {
          const menu = theme.mixins.menu;
          const visibleCount = menu.visibleItems + menu.partialVisibleItem;
          return {
            maxHeight: menu.itemHeight * visibleCount + menu.itemPaddingTop,
            width: menu.width,
          };
        },
      },
    },
  },
});

export default theme;
