import { DomainException } from '../../../../common/domain.exception';

export class OrderItem {
  constructor(
    private readonly productId: string,
    private readonly variantId: string,
    private readonly productName: string,
    private readonly sku: string,
    private readonly unitPrice: number,
    private readonly quantity: number,
  ) {
    if (quantity <= 0) {
      throw new DomainException('Order item quantity must be greater than 0');
    }
    if (unitPrice < 0) {
      throw new DomainException('Order item price cannot be negative');
    }
  }

  getProductId(): string {
    return this.productId;
  }

  getVariantId(): string {
    return this.variantId;
  }

  getProductName(): string {
    return this.productName;
  }

  getSku(): string {
    return this.sku;
  }

  getUnitPrice(): number {
    return this.unitPrice;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getSubtotal(): number {
    return this.unitPrice * this.quantity;
  }

  toJSON() {
    return {
      productId: this.productId,
      variantId: this.variantId,
      productName: this.productName,
      sku: this.sku,
      unitPrice: this.unitPrice,
      quantity: this.quantity,
      subtotal: this.getSubtotal(),
    };
  }
}
