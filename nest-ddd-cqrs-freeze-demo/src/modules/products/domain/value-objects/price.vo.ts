import { DomainException } from '../../../../common/domain.exception';

export class Price {
  constructor(
    private readonly amount: number,
    private readonly currency: string = 'CNY',
  ) {
    if (amount < 0) {
      throw new DomainException('Price amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new DomainException('Currency must be a 3-letter code');
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  multiply(quantity: number): Price {
    return new Price(this.amount * quantity, this.currency);
  }

  equals(other: Price): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
