// utils/spendRollup.ts
import { SpendCategory, Transaction } from '../types/models';

export interface CategorySpend {
  category: SpendCategory;
  amountMinor: number;
  fraction: number; // 0 to 1
  color: string;
}

export interface SpendSummary {
  periodLabel: string;
  totalMinor: number;
  currency: string;
  categories: CategorySpend[];
}

// Colors mapped to our Hyper Lime & Obsidian palette
export const CATEGORY_COLORS: Record<SpendCategory, string> = {
  Food: '#D6FB61',          // Hyper Lime
  Groceries: '#00F2B5',     // Cyan Mint
  Transport: '#4F46E5',     // Indigo Violet
  Shopping: '#F59E0B',      // Amber
  Entertainment: '#EC4899', // Pink
  Bills: '#64748B',         // Slate
  Health: '#10B981',        // Emerald
  Transfers: '#3B82F6',     // Blue
  Other: '#94A3B8',
};

export class SpendRollup {
  static fromTransactions(
    transactions: Transaction[],
    preferredCurrency: string = 'USD',
    periodLabel: string = 'Spent this week'
  ): SpendSummary {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter only outgoing payments within preferred currency in last 7 days
    const relevant = transactions.filter((t) => {
      const txDate = new Date(t.occurredAt);
      return (
        t.amountMinor < 0 &&
        t.currency === preferredCurrency &&
        txDate >= sevenDaysAgo &&
        txDate <= now
      );
    });

    if (relevant.length === 0) {
      return {
        periodLabel,
        totalMinor: 0,
        currency: preferredCurrency,
        categories: [],
      };
    }

    const byCategory: Partial<Record<SpendCategory, number>> = {};
    let total = 0;

    for (const t of relevant) {
      const positiveSpent = Math.abs(t.amountMinor);
      byCategory[t.category] = (byCategory[t.category] || 0) + positiveSpent;
      total += positiveSpent;
    }

    const categories: CategorySpend[] = Object.entries(byCategory)
      .map(([cat, amount]) => ({
        category: cat as SpendCategory,
        amountMinor: amount!,
        fraction: total > 0 ? amount! / total : 0,
        color: CATEGORY_COLORS[cat as SpendCategory] ?? '#94A3B8',
      }))
      .sort((a, b) => b.amountMinor - a.amountMinor)
      .slice(0, 5); // top 5 categories

    return {
      periodLabel,
      totalMinor: total,
      currency: preferredCurrency,
      categories,
    };
  }
}

