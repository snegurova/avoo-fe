import { useApiStatusStore } from '@avoo/store';
import { useCallback, useEffect, useState } from 'react';

export const utils = {
  submitAdapter: <T>(submitFn: (data: T) => void) => {
    return (data: T) => {
      submitFn(data);
    };
  },
  useSetPendingApi: (isPending: boolean) => {
    const setIsPending = useApiStatusStore((state) => state.setIsPending);

    useEffect(() => {
      setIsPending(isPending);
    }, [isPending, setIsPending]);
  },
  useBoolean: (initialValue: boolean = false) => {
    const [value, setValue] = useState(initialValue);
  
    const toggleValue = useCallback(() => {
      setValue((prev) => !prev);
    }, []);
  
    return {
      value,
      setValue,
      toggleValue,
    };
  },
}