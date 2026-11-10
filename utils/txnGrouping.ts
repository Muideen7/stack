// utils/txnGrouping.ts
import { Transaction } from '../types/models';

export interface DayGroup {
  dayDate: Date;
  label: string;
  items: Transaction[];
  netMinor: number;
  currency: string;
}

export class TxnGrouping {
  private static midnight(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  static dayLabel(day: Date, now: Date = new Date()): string {
    const today = this.midnight(now);
    const target = this.midnight(day);

    const diffMs = today.getTime() - target.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    if (target.getFullYear() !== today.getFullYear()) {
      options.year = 'numeric';
    }

    return target.toLocaleDateString('en-US', options);
  }

  static byDay(transactions: Transaction[]): DayGroup[] {
    if (transactions.length === 0) return [];

    const buckets = new Map<string, { date: Date; items: Transaction[] }>();

    for (const tx of transactions) {
      const txDate = new Date(tx.occurredAt);
      const key = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}-${String(txDate.getDate()).padStart(2, '0')}`;

      if (!buckets.has(key)) {
        buckets.set(key, {
          date: new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate()),
          items: [],
        });
      }
      buckets.get(key)!.items.push(tx);
    }

    // Sort days descending
    const sortedKeys = Array.from(buckets.keys()).sort((a, b) => b.localeCompare(a));

    return sortedKeys.map((key) => {
      const bucket = buckets.get(key)!;
      // Sort items within day descending
      bucket.items.sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
      );

      const netMinor = bucket.items.reduce((sum, item) => sum + item.amountMinor, 0);
      const currency = bucket.items[0]?.currency || 'USD';

      return {
        dayDate: bucket.date,
        label: this.dayLabel(bucket.date),
        items: bucket.items,
        netMinor,
        currency,
      };
    });
  }

  static categoriesIn(transactions: Transaction[]): string[] {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set).sort();
  }
}

