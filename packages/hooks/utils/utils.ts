import { useApiStatusStore } from '@avoo/store';
import { useCallback, useEffect, useState } from 'react';

export const utils = {
  submitAdapter: <T, Tfields>(submitFn: (data: T) => void) => {
    return (data: Tfields) => {
      submitFn(data as unknown as T);
    };
  },
  useSetPendingApi: (isPending: boolean) => {
    const setIsPending = useApiStatusStore((state) => state.setIsPending);

    useEffect(() => {
      setIsPending(isPending);
    }, [isPending, setIsPending]);
  },
  useBooleanState: (
    initialValue: boolean = false,
    options?: { onEnable?: () => void; onDisable?: () => void },
  ) => {
    const [value, setValue] = useState(initialValue);
    const { onEnable, onDisable } = options || {};

    const enable = useCallback(() => {
      setValue(true);
      onEnable?.();
    }, [onEnable]);

    const disable = useCallback(() => {
      setValue(false);
      onDisable?.();
    }, [onDisable]);

    const toggleValue = useCallback(() => {
      setValue((prev) => {
        const newValue = !prev;
        if (newValue) {
          onEnable?.();
        } else {
          onDisable?.();
        }
        return newValue;
      });
    }, [onEnable, onDisable]);

    return {
      value,
      setValue,
      toggleValue,
      enable,
      disable,
    };
  },
}