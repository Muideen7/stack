// utils/money.ts

export class Money {
  private static symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    NGN: '₦',
    CAD: 'CA$',
    JPY: '¥',
  };

  /**
   * The currency symbol alone.
   */
  static symbol(currency: string): string {
    return this.symbolMap[currency] ?? `${currency} `;
  }

  /**
   * Format integer minor units (e.g. 2409267 USD -> "$24,092.67")
   */
  static format(minor: number, currency: string = 'USD'): string {
    const absVal = Math.abs(minor) / 100;
    const sym = this.symbol(currency);
    const num = absVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sym}${num}`;
  }

  /**
   * Signed for transactions: "-$4.75" or "+$99.00" or "$0.00"
   */
  static signed(minor: number, currency: string = 'USD'): string {
    if (minor === 0) return this.format(0, currency);
    const sign = minor < 0 ? '-' : '+';
    return `${sign}${this.format(Math.abs(minor), currency)}`;
  }

  /**
   * Splits into major and minor cents so the UI can de-emphasise cents
   * e.g. "$24,092" and ".67"
   */
  static parts(minor: number, currency: string = 'USD'): { major: string; minor: string } {
    const full = this.format(minor, currency);
    const dot = full.lastIndexOf('.');
    if (dot === -1) return { major: full, minor: '' };
    return {
      major: full.substring(0, dot),
      minor: full.substring(dot),
    };
  }
}

