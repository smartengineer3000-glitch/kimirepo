import { Fraction } from './Fraction';
import { FIQH_DATABASE } from '../constants/FiqhDatabase';

/**
 * HeirShare Class - Represents a single heir's share
 * Enhanced with additional metadata and formatting
 */
export class HeirShare {
  key: string;
  name: string;
  type: string;
  count: number;
  fraction: Fraction;
  originalFraction: Fraction;
  reason: string;
  blocked: boolean;
  blockedBy: string | null;
  amount: number;
  amountPerPerson: number;
  shares: number;
  color: string;

  constructor(options: {
    key: string;
    name?: string;
    type?: string;
    count?: number;
    fraction?: Fraction | number;
    reason?: string;
    blocked?: boolean;
    blockedBy?: string | null;
    color?: string;
  }) {
    this.key = options.key;
    this.name = options.name || FIQH_DATABASE.heirNames[options.key] || options.key;
    this.type = options.type || 'فرض';
    this.count = options.count || 1;
    this.fraction = options.fraction instanceof Fraction ? options.fraction : new Fraction(0);
    this.originalFraction = this.fraction.clone();
    this.reason = options.reason || '';
    this.blocked = options.blocked || false;
    this.blockedBy = options.blockedBy || null;
    this.amount = 0;
    this.amountPerPerson = 0;
    this.shares = 0;
    this.color = options.color || this.getDefaultColor();
  }

  private getDefaultColor(): string {
    const colorMap: Record<string, string> = {
      'فرض': '#1565C0',
      'عصبة': '#2E7D32',
      'فرض + تعصيب': '#00897B',
      'عصبة + رد': '#F9A825',
      'ذو رحم': '#7B1FA2',
      'باقي': '#5D5D5D',
      'treasury': '#795548'
    };
    return colorMap[this.type] || '#5D5D5D';
  }

  setFraction(fraction: Fraction | number): void {
    this.fraction = fraction instanceof Fraction ? fraction : new Fraction(fraction);
  }

  addFraction(fraction: Fraction | number): void {
    this.fraction = this.fraction.add(fraction);
  }

  calculateAmount(netEstate: number): void {
    this.amount = netEstate * this.fraction.toDecimal();
    this.amountPerPerson = this.count > 0 ? this.amount / this.count : 0;
  }

  getPerPerson(): Fraction {
    if (this.count <= 0) return new Fraction(0);
    return new Fraction(this.fraction.num, this.fraction.den * this.count);
  }

  getFormattedAmount(currency: string = 'ر.س'): string {
    return `${this.amount.toLocaleString('ar-SA')} ${currency}`;
  }

  getFormattedAmountPerPerson(currency: string = 'ر.س'): string {
    return `${this.amountPerPerson.toLocaleString('ar-SA')} ${currency}`;
  }

  toJSON(): object {
    return {
      key: this.key,
      name: this.name,
      type: this.type,
      count: this.count,
      fraction: this.fraction.toString(),
      fractionArabic: this.fraction.toArabic(),
      percentage: this.fraction.toPercentage(),
      reason: this.reason,
      amount: this.amount,
      amountPerPerson: this.amountPerPerson,
      blocked: this.blocked,
      blockedBy: this.blockedBy
    };
  }
}
