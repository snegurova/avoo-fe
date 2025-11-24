'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@avoo/store';
import { useEffect, ReactNode } from 'react';
import { routes } from '@/_routes/routes';

type Props = {
  children: ReactNode;
};

export const AuthGuard = (props: Props) => {
  const { children } = props;

  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(routes.SignIn);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
