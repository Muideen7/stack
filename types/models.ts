// types/models.ts

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover';

export type CardSkin = 'obsidian' | 'volt' | 'teal' | 'slate' | 'bone' | 'forest' | 'moss' | 'sage';

export type FundingType = 'debit' | 'credit' | 'virtualDebit' | 'prepaid';

export interface PaymentCard {
  id: string;
  last4: string;
  brand: CardBrand;
  funding: FundingType;
  holder: string;
  expiryMonth: number;
  expiryYear: number;
  nickname: string;
  skin: CardSkin;
  balanceMinor: number;   // e.g. 2409267 = $24,092.67
  currency: string;       // USD, EUR, GBP, etc.
  frozen: boolean;
  spendLimitMinor?: number | null;
  artwork?: string | null;
}

export type TransactionKind = 'payment' | 'transfer' | 'topup' | 'exchange';

export type SpendCategory =
  | 'Food'
  | 'Groceries'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Health'
  | 'Transfers'
  | 'Other';

export interface Transaction {
  id: string;
  cardId: string;
  kind: TransactionKind;
  merchant: string;
  category: SpendCategory;
  amountMinor: number;    // Negative for money out (-475 = -$4.75), positive for inflow
  currency: string;
  occurredAt: string;     // ISO 8601
  note?: string | null;
  receipt?: string | null;
}

export interface Recipient {
  id: string;
  name: string;
  handle: string;
  email: string;
  verified: boolean;
  avatar?: string | null;
  lastUsedAt?: string | null;
}

export interface RateTable {
  asOf: string;
  base: string;
  feeBps: number;
  rates: Record<string, number>;
}

export interface UserProfile {
  name: string;
  email: string;
  handle: string;
  avatar?: string | null;
  preferredCurrency: string;
  themeMode: 'system' | 'light' | 'dark';
  showDemoHints: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  occurredAt: string;
  read: boolean;
  type: 'security' | 'transfer' | 'card' | 'system';
}

