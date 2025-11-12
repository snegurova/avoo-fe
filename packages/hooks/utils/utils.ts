import { useApiStore } from '@avoo/store/src/api.store';
import { useEffect } from 'react';

export const utils = {
  submitAdapter: <T>(submitFn: (data: T) => void) => {
    return (data: T) => {
      submitFn(data);
    };
  },
  useSetPendingApi: (isPending: boolean) => {
    const setIsPending = useApiStore((state) => state.setIsPending);

    useEffect(() => {
      setIsPending(isPending);

      return () => {
        if (isPending) {
          setIsPending(false);
        }
      };
    }, [isPending, setIsPending]);
  },
};
