import type { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware';

export const getPlatformStorage = (): StateStorage => {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return {
      getItem: async (name) => {
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
        const value = await AsyncStorage.getItem(name);
        return value ?? null;
      },
      setItem: async (name, value) => {
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.setItem(name, value);
      },
      removeItem: async (name) => {
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.removeItem(name);
      },
    };
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: (name) => Promise.resolve(window.localStorage.getItem(name)),
      setItem: (name, value) => Promise.resolve(window.localStorage.setItem(name, value)),
      removeItem: (name) => Promise.resolve(window.localStorage.removeItem(name)),
    };
  }

  let tempSSRStorage: Record<string, string> = {};
  return {
    getItem: (name) => tempSSRStorage[name] ?? null,
    setItem: (name, value) => (tempSSRStorage[name] = value),
    removeItem: (name) => delete tempSSRStorage[name],
  };
};

export function createZustandStorage<T>(storage: StateStorage): PersistStorage<T> {
  return {
    getItem: async (name): Promise<StorageValue<T> | null> => {
      const str = await storage.getItem(name);
      if (!str) return null;

      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    },

    setItem: async (name, value): Promise<void> => {
      await storage.setItem(name, JSON.stringify(value));
    },

    removeItem: async (name): Promise<void> => {
      await storage.removeItem(name);
    },
  };
}
