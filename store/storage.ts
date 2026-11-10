// store/storage.ts
import { MMKV } from 'react-native-mmkv';

let mmkvInstance: MMKV | null = null;
try {
  mmkvInstance = new MMKV();
} catch {
  // Fallback for web or non-native unit tests
}

const memoryFallback = new Map<string, string>();

export const appStorage = {
  getString: (key: string): string | undefined => {
    if (mmkvInstance) {
      return mmkvInstance.getString(key);
    }
    return memoryFallback.get(key);
  },
  set: (key: string, value: string): void => {
    if (mmkvInstance) {
      mmkvInstance.set(key, value);
    } else {
      memoryFallback.set(key, value);
    }
  },
  delete: (key: string): void => {
    if (mmkvInstance) {
      mmkvInstance.delete(key);
    } else {
      memoryFallback.delete(key);
    }
  },
  clearAll: (): void => {
    if (mmkvInstance) {
      mmkvInstance.clearAll();
    } else {
      memoryFallback.clear();
    }
  },
};

