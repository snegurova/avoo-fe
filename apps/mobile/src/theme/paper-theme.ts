import { MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { colors, typography, radius } from '@avoo/design-tokens';

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
    default: {
      ...MD3LightTheme.fonts.default,
      fontWeight: typography.fontWeight.regular,
    },
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
    },
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.regular,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.regular,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.regular,
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
    },
  },
};

export default paperTheme;