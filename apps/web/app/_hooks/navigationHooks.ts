'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { routes } from '@/_routes/routes';

export const navigationHooks = {
  useHandleNavigateToHomeClick: () => {
    const router = useRouter();
    return useCallback(() => {
      router.push(routes.Home);
    }, [router]);
  },
};
