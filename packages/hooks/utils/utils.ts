import { useApiStore } from '@avoo/store/src/api.store';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  useBoolean: (initialValue: boolean = false) => {
    const [value, setValue] = useState(initialValue);
  
    const toggle = useCallback(() => {
      setValue((prev) => !prev);
    }, []);
  
    return useMemo(
      () => ({
        value,
        setValue,
        toggle,
      }),
      [value, toggle]
    );
  },
}