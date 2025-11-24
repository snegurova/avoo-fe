import { createJSONStorage, PersistStorage, StorageValue } from 'zustand/middleware';

export { createJSONStorage };

let customStorage: PersistStorage<unknown> | null = null;
let defaultBrowserStorage: PersistStorage<unknown> | null = null;

export const setStorage = <T = unknown>(storage: PersistStorage<T>) => {
  customStorage = storage as PersistStorage<unknown>;
};

const getActualStorage = <T = unknown>(): PersistStorage<T> => {
  if (customStorage) {
    return customStorage as PersistStorage<T>;
  }

  if (!defaultBrowserStorage) {
    defaultBrowserStorage = createJSONStorage(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
      }
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    });
  }

  return defaultBrowserStorage as PersistStorage<T>;
};

export const getStorage = <T = unknown>(): PersistStorage<T> => {
  return {
    getItem: (name: string) => {
      const storage = getActualStorage<T>();
      return storage.getItem(name);
    },
    setItem: (name: string, value: StorageValue<T>) => {
      const storage = getActualStorage<T>();
      return storage.setItem(name, value);
    },
    removeItem: (name: string) => {
      const storage = getActualStorage<T>();
      return storage.removeItem(name);
    },
  };
};
