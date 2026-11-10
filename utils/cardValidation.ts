// utils/cardValidation.ts
import { CardBrand } from '../types/models';

export interface CardBrandInfo {
  label: string;
  short: string;
  numberLength: number;
  cvcLength: number;
  grouping: number[];
}

export const CARD_BRANDS: Record<CardBrand, CardBrandInfo> = {
  visa: { label: 'Visa', short: 'Visa', numberLength: 16, cvcLength: 3, grouping: [4, 4, 4, 4] },
  mastercard: { label: 'Mastercard', short: 'Mastercard', numberLength: 16, cvcLength: 3, grouping: [4, 4, 4, 4] },
  amex: { label: 'American Express', short: 'Amex', numberLength: 15, cvcLength: 4, grouping: [4, 6, 5] },
  discover: { label: 'Discover', short: 'Discover', numberLength: 16, cvcLength: 3, grouping: [4, 4, 4, 4] },
};

export class CardValidation {
  static digitsOnly(str: string): string {
    return str.replace(/\D/g, '');
  }

  /**
   * Luhn mod-10 checksum validation
   */
  static luhn(digits: string): boolean {
    if (digits.length < 12) return false;
    let sum = 0;
    let double_ = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (isNaN(digit)) return false;
      if (double_) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      double_ = !double_;
    }
    return sum % 10 === 0;
  }

  /**
   * Detect brand from leading digits
   */
  static detectBrand(digits: string): CardBrand {
    const d = this.digitsOnly(digits);
    if (!d) return 'visa';

    if (d.startsWith('4')) return 'visa';
    const h2 = parseInt(d.substring(0, 2), 10);
    if (h2 === 34 || h2 === 37) return 'amex';
    if (h2 >= 51 && h2 <= 55) return 'mastercard';
    if (h2 === 65) return 'discover';

    const h4 = parseInt(d.substring(0, 4), 10);
    if (h4 >= 2221 && h4 <= 2720) return 'mastercard';
    if (h4 === 6011) return 'discover';

    return 'visa';
  }

  /**
   * Group card digits with spacing according to brand pattern (e.g. 4-4-4-4 or 4-6-5)
   */
  static format(digits: string, brand: CardBrand = 'visa'): string {
    const clean = this.digitsOnly(digits);
    const brandInfo = CARD_BRANDS[brand] || CARD_BRANDS.visa;
    const groups = brandInfo.grouping;

    const parts: string[] = [];
    let idx = 0;
    for (const len of groups) {
      if (idx >= clean.length) break;
      parts.push(clean.substring(idx, idx + len));
      idx += len;
    }
    if (idx < clean.length) {
      parts.push(clean.substring(idx));
    }
    return parts.join(' ');
  }

  /**
   * Validate card number. Returns error string or null if valid.
   */
  static validateNumber(raw: string): string | null {
    const d = this.digitsOnly(raw);
    if (!d) return 'Enter your card number';
    const brand = this.detectBrand(d);
    const expected = CARD_BRANDS[brand].numberLength;
    if (d.length < expected) return 'Card number is too short';
    if (d.length > expected) return 'Card number is too long';
    if (!this.luhn(d)) return 'Check the card number and try again';
    return null;
  }

  /**
   * Validate expiry MM/YY
   */
  static validateExpiry(raw: string): string | null {
    const d = this.digitsOnly(raw);
    if (!d) return 'Enter the expiry date';
    if (d.length < 4) return 'Use MM/YY format';
    const mm = parseInt(d.substring(0, 2), 10);
    const yy = parseInt(d.substring(2, 4), 10);
    if (mm < 1 || mm > 12) return 'Invalid expiry month';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const fullYear = 2000 + yy;

    if (fullYear < currentYear || (fullYear === currentYear && mm < currentMonth)) {
      return 'That card has expired';
    }
    return null;
  }

  /**
   * Validate CVC
   */
  static validateCvc(raw: string, brand: CardBrand = 'visa'): string | null {
    const d = this.digitsOnly(raw);
    if (!d) return 'Enter the security code';
    const expected = CARD_BRANDS[brand].cvcLength;
    if (d.length !== expected) {
      return `Security code must be ${expected} digits`;
    }
    return null;
  }
}

