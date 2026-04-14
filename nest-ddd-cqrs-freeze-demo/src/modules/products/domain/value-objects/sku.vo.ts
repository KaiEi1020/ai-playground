import { DomainException } from '../../../../common/domain.exception';

export class SKU {
  constructor(private readonly value: string) {
    if (!value || value.length < 3) {
      throw new DomainException('SKU must be at least 3 characters');
    }
    if (!/^[A-Z0-9-]+$/.test(value)) {
      throw new DomainException('SKU must contain only uppercase letters, numbers, and hyphens');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SKU): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
