'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { appRoutes } from '@/_routes/routes';

export const routerHooks = {
  useHandleNavigateToHomeClick: () => {
    const router = useRouter();
    return useCallback(() => {
      router.push(appRoutes.Home);
    }, [router]);
  },
  useBackWithFallback: (fallback: appRoutes, backTo?: appRoutes) => {
    const router = useRouter();
    return useCallback(() => {
      if (backTo) {
        router.push(backTo);
      } else {
        router.push(fallback);
      }
    }, [router, fallback, backTo]);
  },
  useIsValidRoute: (path: string | null): path is appRoutes => {
    const validRoutes = new Set<string>(Object.values(appRoutes));

    if (path === null) return false;
    return validRoutes.has(path);
  },
  useIsActivePage: (pagePath: string) => {
    const pathname = usePathname();

    return pathname === pagePath;
  },
};
