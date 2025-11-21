'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@avoo/store';
import { useEffect, ReactNode } from 'react';
import { routes } from '@/_routes/routes';

type AuthGuardProps = {
  children: ReactNode;
  requireAuth?: boolean;
};

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push(routes.SignIn);
    } else if (!requireAuth && isAuthenticated) {
      router.push(routes.Home);
    }
  }, [isAuthenticated, requireAuth, router]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
