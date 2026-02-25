'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { AppRoutes } from '@/_routes/routes';
import { Route } from 'next';
import { localizationHooks } from '@/_hooks/localizationHooks';

export const routerHooks = {
  useHandleNavigateToHomeClick: () => {
    const router = useRouter();
    return useCallback(() => {
      router.push(localizationHooks.useWithLocale(AppRoutes.Home));
    }, [router]);
  },
  useBackWithFallback: (fallback: Route, backTo?: Route) => {
    const router = useRouter();
    return useCallback(() => {
      if (backTo) {
        router.push(backTo);
      } else {
        router.push(fallback);
      }
    }, [router, fallback, backTo]);
  },
  useIsValidRoute: (path: string | null): path is AppRoutes => {
    const validRoutes = new Set<string>(Object.values(AppRoutes));

    if (path === null) return false;
    return validRoutes.has(path);
  },
  useIsActivePage: (pagePath: string) => {
    const pathname = usePathname();

    return pathname === pagePath;
  },
};
