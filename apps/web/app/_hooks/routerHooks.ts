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
  useBackWithFallback: (fallback: appRoutes) => {
    const router = useRouter();
    return useCallback(() => {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push(fallback);
      }
    }, [router, fallback]);
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
