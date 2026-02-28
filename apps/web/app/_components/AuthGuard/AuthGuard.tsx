'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useHydrationStore } from '@avoo/store';
import { useEffect, ReactNode } from 'react';
import { AppRoutes } from '@/_routes/routes';
import { localizationHooks } from '@/_hooks/localizationHooks';

type Props = {
  children: ReactNode;
};

export const AuthGuard = (props: Props) => {
  const { children } = props;

  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useHydrationStore((state) => state.hasHydrated);

  const siginInWithLocaleRedirect = localizationHooks.useWithLocale(AppRoutes.SignIn)

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated && pathname) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${siginInWithLocaleRedirect}?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, hasHydrated, router, pathname]);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
