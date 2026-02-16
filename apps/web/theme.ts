'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { colors, breakpoints, radius, typography } from '@avoo/design-tokens';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

declare module '@mui/material/IconButton' {
  interface IconButtonPropsVariantOverrides {
    avatarEdit: true;
  }
}

declare module '@mui/material/styles' {
  interface Mixins {
    menu: {
      itemHeight: number;
      itemPaddingTop: number;
      visibleItems: number;
      partialVisibleItem: number;
      width: number | string;
    };
    formInput: {
      height: number | string;
      borderRadius: number | string;
      borderColor: string;
      focusRingColor: string;
      background: string;
      padding: string;
    };
    searchInput: {
      height: number | string;
      borderRadius: number | string;
      iconSize: number | string;
      iconMarginLeft: number | string;
      widthMd: string;
      widthLg: string;
      mrMd: number | string;
      mrLg: number | string;
    };
  }

  interface MixinsOptions {
    menu?: {
      itemHeight?: number;
      itemPaddingTop?: number;
      visibleItems?: number;
      partialVisibleItem?: number;
      width?: number | string;
    };
    formInput?: {
      height?: number | string;
      borderRadius?: number | string;
      borderColor?: string;
      focusRingColor?: string;
      background?: string;
      padding?: string;
    };
    searchInput?: {
      height?: number | string;
      borderRadius?: number | string;
      iconSize?: number | string;
      iconMarginLeft?: number | string;
      widthMd?: string;
      widthLg?: string;
      mrMd?: number | string;
      mrLg?: number | string;
    };
  }
}

const theme = createTheme({
  colorSchemes: { light: true, dark: false },
  cssVariables: true,
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontWeightRegular: Number(typography.fontWeight.regular),
    fontWeightMedium: Number(typography.fontWeight.medium),
    fontWeightBold: Number(typography.fontWeight.bold),
    h1: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.medium,
      lineHeight: 1.5,
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
    formInput: {
      height: 44,
      borderRadius: radius.md,
      borderColor: colors.gray[200],
      focusRingColor: colors.primary[800],
      background: 'transparent',
      padding: '0.75rem',
    },
    searchInput: {
      height: 44,
      borderRadius: 18,
      iconSize: 24,
      iconMarginLeft: 12,
      widthMd: '306px',
      widthLg: '306px',
      mrMd: 32,
      mrLg: 48,
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
            paddingLeft: 14,
            paddingRight: 14,
            position: 'relative',
          },

          '& .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.gray[200],
          },
          '& .MuiPickersInputBase-root:hover .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.gray[200],
          },
          '& .MuiPickersInputBase-root.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline':
            {
              borderColor: colors.primary[500],
            },
          '& .MuiPickersInputBase-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
            borderWidth: 1,
          },
          '& .MuiPickersInputBase-root.Mui-focused.Mui-error .MuiPickersOutlinedInput-notchedOutline':
            {
              borderColor: colors.red[500],
            },
          '& .MuiPickersSectionList-root': {
            padding: '8px 0',
            fontSize: typography.fontSize.sm,
            lineHeight: 1.15,
            color: 'var(--color-gray-800)',
            width: 'min-content',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: () => ({
          '& label + .MuiInputBase-root': {
            marginTop: '4px',
          },
          '& .MuiOutlinedInput-root': {
            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.gray[200] },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.gray[200] },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[500] },
          },
        }),
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
          '& .MuiButtonBase-root': {
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            paddingRight: 20,
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'transparent',
          },
          '& .MuiButtonBase-root:active': {
            backgroundColor: 'transparent',
          },
          '& .MuiButtonBase-root:focus': {
            backgroundColor: 'transparent',
          },
          margin: 0,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState?: { variant?: string; color?: string } }) => ({
          minHeight: 44,
          ...(ownerState?.variant === 'outlined' &&
            ownerState?.color === 'primary' && {
              color: colors.primary[700],
              borderColor: colors.primary[700],
              '&:hover': { backgroundColor: colors.primary[50] },
            }),
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: () => ({
          '&.avatar-edit': {
            width: 44,
            height: 44,
            padding: '12px',
            borderRadius: '50%',
            border: '1px solid',
            borderColor: colors.gray[200],
            backgroundColor: colors.white,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            color: colors.gray[300],
            '&:hover': { backgroundColor: colors.primary[50], borderColor: colors.gray[200] },
            '&:active': { backgroundColor: colors.primary[50] },
            '&.Mui-focusVisible': { boxShadow: `0 0 0 2px ${colors.primary[500]}` },
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: radius.md,
          ...(ownerState?.multiline
            ? {
                alignItems: 'stretch',
              }
            : {
                height: 44,
              }),
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
    MuiSnackbar: {
      styleOverrides: {
        root: {
          marginTop: '70px',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
    },
  },
});

export default theme;
