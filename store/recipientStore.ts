// store/recipientStore.ts
import { create } from 'zustand';
import { Recipient } from '../types/models';
import { appStorage } from './storage';
import rawSeed from '../data/seed/recipients.json';

const STORAGE_KEY = '@stack_recipients_v1';

function loadInitialRecipients(): Recipient[] {
  const stored = appStorage.getString(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }

  const rawRecipients = (rawSeed as { recipients: any[] }).recipients;
  const initial: Recipient[] = rawRecipients.map((r) => ({
    id: r.id,
    name: r.name,
    handle: r.handle,
    email: r.email,
    verified: Boolean(r.verified),
    avatar: r.avatar,
    lastUsedAt: r.lastUsedAt,
  }));

  appStorage.set(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

interface RecipientState {
  recipients: Recipient[];
  addRecipient: (data: Omit<Recipient, 'id'>) => Recipient;
  touchRecipient: (id: string) => void;
  resetToSeed: () => void;
}

export const useRecipientStore = create<RecipientState>((set, get) => ({
  recipients: loadInitialRecipients(),

  addRecipient: (data) => {
    const newRecipient: Recipient = {
      ...data,
      id: `r_${Date.now()}`,
      lastUsedAt: new Date().toISOString(),
    };
    const next = [newRecipient, ...get().recipients];
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ recipients: next });
    return newRecipient;
  },

  touchRecipient: (id: string) => {
    const next = get().recipients.map((r) =>
      r.id === id ? { ...r, lastUsedAt: new Date().toISOString() } : r
    );
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ recipients: next });
  },

  resetToSeed: () => {
    appStorage.delete(STORAGE_KEY);
    set({ recipients: loadInitialRecipients() });
  },
}));

