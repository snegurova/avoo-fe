'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@avoo/hooks';
import { ReactNode } from 'react';

const __DEV__ = process.env.NODE_ENV === 'development';

type Props = {
  children: ReactNode;
};

export function QueryProvider(props: Props) {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {__DEV__ && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right' />
      )}
    </QueryClientProvider>
  );
}
