import { QueryClient } from '@tanstack/react-query';

export const invalidateOrderQueries = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['calendar'] }),
    queryClient.invalidateQueries({ queryKey: ['monthCalendar'] }),
    queryClient.invalidateQueries({ queryKey: ['orders'] }),
  ]);
