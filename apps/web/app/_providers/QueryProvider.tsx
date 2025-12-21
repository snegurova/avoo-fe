'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@avoo/hooks';
import { setClearQueryClientCallback } from '@avoo/axios';
import { ReactNode, useEffect } from 'react';

const __DEV__ = process.env.NODE_ENV === 'development';

type Props = {
  children: ReactNode;
};

export function QueryProvider(props: Props) {
  const { children } = props;

  useEffect(() => {
    setClearQueryClientCallback(() => {
      queryClient.clear();
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {__DEV__ && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right' />
      )}
    </QueryClientProvider>
  );
}
