'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export const navigationHooks = {
  useHandleBackClick: () => {
    const router = useRouter();

    return useCallback(() => {
      router.back();
    }, [router]);
  },
  useIsActivePage: (pagePath: string) => {
    const pathname = usePathname();

    return pathname === pagePath;
  },
};
