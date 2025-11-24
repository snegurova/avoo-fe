'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const navigationHooks = {
  useHandleBackClick: () => {
    const router = useRouter();

    return useCallback(() => {
      router.back();
    }, [router]);
  },
};

