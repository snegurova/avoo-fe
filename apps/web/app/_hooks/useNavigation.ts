'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useNavigation = () => {
  const router = useRouter();

  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  return {
    router,
    handleBackClick,
  };
};

