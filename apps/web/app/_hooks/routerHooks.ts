'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { routes } from '@/_routes/routes';

export const routerHooks = {
  useHandleNavigateToHomeClick: () => {
    const router = useRouter();
    return useCallback(() => {
      router.push(routes.Home);
    }, [router]);
  },
  useIsValidRoute: (path: string | null): path is routes => {
    const validRoutes = new Set<string>(Object.values(routes));

    if (path === null) return false;
    return validRoutes.has(path);
  },
};
