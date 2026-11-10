// store/transactionStore.ts
import { create } from 'zustand';
import { SpendCategory, Transaction } from '../types/models';
import { appStorage } from './storage';
import rawSeed from '../data/seed/transactions.json';

const STORAGE_KEY = '@stack_transactions_v1';

function loadInitialTransactions(): Transaction[] {
  const stored = appStorage.getString(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }

  const rawTxns = (rawSeed as { transactions: any[] }).transactions;
  const initial: Transaction[] = rawTxns.map((t) => ({
    id: t.id,
    cardId: t.cardId,
    kind: t.kind,
    merchant: t.merchant,
    category: t.category as SpendCategory,
    amountMinor: t.amountMinor,
    currency: t.currency,
    occurredAt: t.occurredAt,
    note: t.note,
    receipt: t.receipt,
  }));

  appStorage.set(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

interface TransactionState {
  transactions: Transaction[];
  searchQuery: string;
  selectedCategory: SpendCategory | 'All';
  selectedCardId: string | 'All';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: SpendCategory | 'All') => void;
  setSelectedCardId: (cardId: string | 'All') => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'occurredAt'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  resetToSeed: () => void;
  filteredTransactions: () => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: loadInitialTransactions(),
  searchQuery: '',
  selectedCategory: 'All',
  selectedCardId: 'All',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedCardId: (selectedCardId) => set({ selectedCardId }),

  addTransaction: (txData) => {
    const newTx: Transaction = {
      ...txData,
      id: `t_${Date.now()}`,
      occurredAt: new Date().toISOString(),
    };
    const next = [newTx, ...get().transactions];
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ transactions: next });
    return newTx;
  },

  updateTransaction: (id, updates) => {
    const next = get().transactions.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ transactions: next });
  },

  resetToSeed: () => {
    appStorage.delete(STORAGE_KEY);
    set({ transactions: loadInitialTransactions(), searchQuery: '', selectedCategory: 'All', selectedCardId: 'All' });
  },

  filteredTransactions: () => {
    const { transactions, searchQuery, selectedCategory, selectedCardId } = get();
    return transactions.filter((t) => {
      if (selectedCategory !== 'All' && t.category !== selectedCategory) {
        return false;
      }
      if (selectedCardId !== 'All' && t.cardId !== selectedCardId) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesMerchant = t.merchant.toLowerCase().includes(q);
        const matchesNote = t.note?.toLowerCase().includes(q) ?? false;
        if (!matchesMerchant && !matchesNote) return false;
      }
      return true;
    });
  },
}));

