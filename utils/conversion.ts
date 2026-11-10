// utils/conversion.ts
import { PaymentCard, RateTable } from '../types/models';

export interface ConversionQuote {
  fromCurrency: string;
  toCurrency: string;
  amountMinor: number;
  feeMinor: number;
  convertedMinor: number;
  rate: number;
  netMinor: number;
  rateLabel: string;
}

export interface ConversionCheck {
  ok: boolean;
  quote: ConversionQuote;
  reason?: string;
}

export class Conversion {
  /**
   * Quote amountMinor of fromCurrency into toCurrency.
   */
  static quote(
    fromCurrency: string,
    toCurrency: string,
    amountMinor: number,
    table: RateTable
  ): ConversionQuote {
    const fromRate = table.rates[fromCurrency] ?? 1.0;
    const toRate = table.rates[toCurrency] ?? 1.0;
    const rate = toRate / fromRate;

    const amount = Math.max(0, amountMinor);
    const feeMinor = fromCurrency === toCurrency
      ? 0
      : Math.round((amount * table.feeBps) / 10000);
    const net = amount - feeMinor;
    const convertedMinor = Math.round(net * rate);

    return {
      fromCurrency,
      toCurrency,
      amountMinor: amount,
      feeMinor,
      convertedMinor,
      rate,
      netMinor: net,
      rateLabel: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`,
    };
  }

  /**
   * Validate whether transfer between two cards is allowable.
   */
  static check(
    from: PaymentCard | null,
    to: PaymentCard | null,
    amountMinor: number,
    table: RateTable
  ): ConversionCheck {
    const q = this.quote(
      from?.currency ?? table.base,
      to?.currency ?? table.base,
      amountMinor,
      table
    );

    if (!from || !to) {
      return { ok: false, quote: q, reason: 'Select both origin and destination cards.' };
    }
    if (from.id === to.id) {
      return { ok: false, quote: q, reason: 'Select two different cards.' };
    }
    if (!table.rates[from.currency] || !table.rates[to.currency]) {
      const missing = !table.rates[from.currency] ? from.currency : to.currency;
      return { ok: false, quote: q, reason: `No exchange rate available for ${missing}.` };
    }
    if (from.frozen) {
      return { ok: false, quote: q, reason: `${from.nickname} is frozen. Unfreeze it to transfer out.` };
    }
    if (to.frozen) {
      return { ok: false, quote: q, reason: `${to.nickname} is frozen.` };
    }
    if (amountMinor <= 0) {
      return { ok: false, quote: q, reason: 'Enter an amount to convert.' };
    }
    if (from.balanceMinor < amountMinor) {
      return { ok: false, quote: q, reason: 'Insufficient card balance.' };
    }
    if (from.spendLimitMinor && amountMinor > from.spendLimitMinor) {
      return { ok: false, quote: q, reason: 'Amount exceeds this card’s monthly spend limit.' };
    }

    return { ok: true, quote: q };
  }
}

