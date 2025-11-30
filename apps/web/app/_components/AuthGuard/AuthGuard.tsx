'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore, useHydrationStore } from '@avoo/store';
import { useEffect, ReactNode } from 'react';
import { appRoutes } from '@/_routes/routes';

type Props = {
  children: ReactNode;
};

export const AuthGuard = (props: Props) => {
  const { children } = props;

  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useHydrationStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push(appRoutes.SignIn);
    }
  }, [isAuthenticated, hasHydrated, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
