// PLEASE NOTE: Import directly from storage.ts, bypassing index.ts otherwise it will load the auth.store.ts first and then set the storage
import { setStorage, createJSONStorage } from '../../../packages/store/src/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mobileStorage = createJSONStorage(() => AsyncStorage);
if (!mobileStorage) {
  throw new Error('Failed to create JSON storage for mobile');
}
setStorage(mobileStorage);
