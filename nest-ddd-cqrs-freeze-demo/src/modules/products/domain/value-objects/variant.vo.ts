import { randomUUID } from 'crypto';
import { DomainException } from '../../../../common/domain.exception';
import { Price } from './price.vo';
import { SKU } from './sku.vo';

export interface VariantAttributes {
  [key: string]: string;
}

export class ProductVariant {
  constructor(
    private readonly id: string,
    private readonly sku: SKU,
    private readonly attributes: VariantAttributes,
    private price: Price,
    private stockQuantity: number,
    private isActive: boolean = true,
  ) {}

  static create(
    sku: string,
    attributes: VariantAttributes,
    price: Price,
    stockQuantity: number,
  ): ProductVariant {
    return new ProductVariant(
      randomUUID(),
      new SKU(sku),
      attributes,
      price,
      stockQuantity,
    );
  }

  static rehydrate(
    id: string,
    sku: string,
    attributes: VariantAttributes,
    price: Price,
    stockQuantity: number,
    isActive: boolean,
  ): ProductVariant {
    return new ProductVariant(
      id,
      new SKU(sku),
      attributes,
      price,
      stockQuantity,
      isActive,
    );
  }

  getId(): string {
    return this.id;
  }

  getSKU(): SKU {
    return this.sku;
  }

  getAttributes(): VariantAttributes {
    return { ...this.attributes };
  }

  getPrice(): Price {
    return this.price;
  }

  getStockQuantity(): number {
    return this.stockQuantity;
  }

  isVariantActive(): boolean {
    return this.isActive;
  }

  updatePrice(newPrice: Price): void {
    this.price = newPrice;
  }

  decreaseStock(quantity: number): void {
    if (quantity > this.stockQuantity) {
      throw new DomainException(`Insufficient stock for variant ${this.sku.getValue()}`);
    }
    this.stockQuantity -= quantity;
  }

  increaseStock(quantity: number): void {
    this.stockQuantity += quantity;
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }

  toJSON() {
    return {
      id: this.id,
      sku: this.sku.getValue(),
      attributes: this.attributes,
      price: this.price.toJSON(),
      stockQuantity: this.stockQuantity,
      isActive: this.isActive,
    };
  }
}
