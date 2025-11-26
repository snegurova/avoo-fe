import type { StateStorage, StorageValue, PersistStorage } from "zustand/middleware";

export const getPlatformStorage = (): StateStorage => {
  
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;

    return {
      getItem: async (name) => {
        const value = await AsyncStorage.getItem(name);
        return value ?? null;
      },
      setItem: async (name, value) => {
        await AsyncStorage.setItem(name, value);
      },
      removeItem: async (name) => {
        await AsyncStorage.removeItem(name);
      },
    };
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return {
      getItem: async (name) => window.localStorage.getItem(name),
      setItem: async (name, value) => window.localStorage.setItem(name, value),
      removeItem: async (name) => window.localStorage.removeItem(name),
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

