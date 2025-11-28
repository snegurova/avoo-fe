import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/../theme';

export function MUIThemeProvider({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
