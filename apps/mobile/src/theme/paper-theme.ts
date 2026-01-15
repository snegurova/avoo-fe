import { MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { colors, typography, radius } from '@avoo/design-tokens';

const fontFamilyMapper: Record<string, string> = {
  '200': 'Roboto-ExtraLight',
  '300': 'Roboto-Light',
  '400': 'Roboto-Regular',
  '500': 'Roboto-Medium',
  '600': 'Roboto-SemiBold',
  '700': 'Roboto-Bold',
  '800': 'Roboto-ExtraBold',
};

const getFontFamily = (fontWeight: string): string => {
  return fontFamilyMapper[fontWeight] || 'Roboto-Regular';
};

const paperTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: radius.md, 
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[500],
    primaryContainer: colors.primary[100],
    secondary: colors.black,
    secondaryContainer: colors.white,
    tertiary: colors.blue[500],
    tertiaryContainer: colors.blue[100],
    error: colors.red[500],
    errorContainer: colors.red[100],
    surface: colors.white,
    surfaceVariant: colors.gray[100],
    background: colors.white,
    outline: colors.gray[300],
    outlineVariant: colors.gray[200],
    onPrimary: colors.white,
    onPrimaryContainer: colors.primary[900],
    onSecondary: colors.white,
    onSecondaryContainer: colors.purple[900],
    onTertiary: colors.white,
    onTertiaryContainer: colors.blue[900],
    onError: colors.white,
    onErrorContainer: colors.red[900],
    onSurface: colors.black,
    onSurfaceVariant: colors.gray[700],
    onBackground: colors.black,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: getFontFamily(typography.fontWeight.medium),
      fontSize: typography.fontSize.xl,
      lineHeight: 30,
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: getFontFamily(typography.fontWeight.medium),
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: getFontFamily(typography.fontWeight.medium),
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: getFontFamily(typography.fontWeight.regular),
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.regular,
      lineHeight: 14,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: getFontFamily(typography.fontWeight.regular),
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.regular,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: getFontFamily(typography.fontWeight.medium),
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: getFontFamily(typography.fontWeight.medium),
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
    },
  },
};

export default paperTheme;