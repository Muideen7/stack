// store/walletStore.ts
import { create } from 'zustand';
import { PaymentCard } from '../types/models';
import { appStorage } from './storage';
import rawSeed from '../data/seed/cards.json';

const STORAGE_KEY = '@stack_cards_v1';
const APP_NAME = 'Stack';

function loadInitialCards(): PaymentCard[] {
  const stored = appStorage.getString(STORAGE_KEY);
  if (stored) {
    try {
      const parsed: PaymentCard[] = JSON.parse(stored);
      if (parsed.length > 0 && !parsed.some((c) => c.holder === 'OLYMPICSON' || c.holder === 'ALEX STACK')) {
        return parsed;
      }
    } catch {
      // Fallback on parse failure
    }
  }

  const rawCards = (rawSeed as { cards: any[] }).cards;
  const initial: PaymentCard[] = rawCards.map((c) => ({
    id: c.id,
    last4: c.last4,
    brand: c.brand,
    funding: c.funding,
    holder: c.holder,
    expiryMonth: c.expiryMonth,
    expiryYear: c.expiryYear,
    nickname: (c.nickname || '').replace('{app}', APP_NAME),
    skin: c.skin,
    balanceMinor: c.balanceMinor,
    currency: c.currency,
    frozen: Boolean(c.frozen),
    spendLimitMinor: c.spendLimitMinor,
    artwork: c.artwork,
  }));

  appStorage.set(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

interface WalletState {
  cards: PaymentCard[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  toggleFreeze: (cardId: string) => void;
  addCard: (card: Omit<PaymentCard, 'id'>) => PaymentCard;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<PaymentCard>) => void;
  adjustBalance: (cardId: string, deltaMinor: number) => void;
  resetToSeed: () => void;
  totalBalanceMinor: (targetCurrency?: string) => number;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  cards: loadInitialCards(),
  activeCardIndex: 0,

  setActiveCardIndex: (index: number) => {
    set({ activeCardIndex: Math.max(0, Math.min(index, get().cards.length - 1)) });
  },

  toggleFreeze: (cardId: string) => {
    const next = get().cards.map((c) =>
      c.id === cardId ? { ...c, frozen: !c.frozen } : c
    );
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ cards: next });
  },

  addCard: (cardData) => {
    const newCard: PaymentCard = {
      ...cardData,
      id: `c_${Date.now()}`,
    };
    const next = [...get().cards, newCard];
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ cards: next, activeCardIndex: next.length - 1 });
    return newCard;
  },

  removeCard: (cardId: string) => {
    const next = get().cards.filter((c) => c.id !== cardId);
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ cards: next, activeCardIndex: 0 });
  },

  updateCard: (cardId: string, updates: Partial<PaymentCard>) => {
    const next = get().cards.map((c) =>
      c.id === cardId ? { ...c, ...updates } : c
    );
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ cards: next });
  },

  adjustBalance: (cardId: string, deltaMinor: number) => {
    const next = get().cards.map((c) =>
      c.id === cardId ? { ...c, balanceMinor: c.balanceMinor + deltaMinor } : c
    );
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ cards: next });
  },

  resetToSeed: () => {
    appStorage.delete(STORAGE_KEY);
    set({ cards: loadInitialCards(), activeCardIndex: 0 });
  },

  totalBalanceMinor: (targetCurrency: string = 'USD') => {
    // Sums balances of cards matching target currency
    return get()
      .cards.filter((c) => c.currency === targetCurrency)
      .reduce((sum, c) => sum + c.balanceMinor, 0);
  },
}));

