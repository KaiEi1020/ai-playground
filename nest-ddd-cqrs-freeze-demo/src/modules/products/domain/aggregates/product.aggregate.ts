import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { DomainException } from '../../../../common/domain.exception';
import { Price } from '../value-objects/price.vo';
import { ProductVariant, VariantAttributes } from '../value-objects/variant.vo';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export class ProductAggregate extends AggregateRoot {
  private variants: Map<string, ProductVariant> = new Map();

  private constructor(
    private readonly id: string,
    private name: string,
    private description: string,
    private categoryId: string,
    private status: ProductStatus,
    private readonly createdAt: Date,
  ) {
    super();
  }

  static create(
    name: string,
    description: string,
    categoryId: string,
  ): ProductAggregate {
    const product = new ProductAggregate(
      randomUUID(),
      name,
      description,
      categoryId,
      ProductStatus.DRAFT,
      new Date(),
    );
    return product;
  }

  static rehydrate(
    id: string,
    name: string,
    description: string,
    categoryId: string,
    status: ProductStatus,
    createdAt: Date,
    variants: ProductVariant[],
  ): ProductAggregate {
    const product = new ProductAggregate(
      id,
      name,
      description,
      categoryId,
      status,
      createdAt,
    );
    variants.forEach((v) => product.variants.set(v.getId(), v));
    return product;
  }

  addVariant(
    sku: string,
    attributes: VariantAttributes,
    price: Price,
    stockQuantity: number,
  ): ProductVariant {
    const existingSku = Array.from(this.variants.values()).find(
      (v) => v.getSKU().getValue() === sku,
    );
    if (existingSku) {
      throw new DomainException(`SKU ${sku} already exists`);
    }

    const variant = ProductVariant.create(sku, attributes, price, stockQuantity);
    this.variants.set(variant.getId(), variant);
    return variant;
  }

  removeVariant(variantId: string): void {
    const variant = this.variants.get(variantId);
    if (!variant) {
      throw new DomainException('Variant not found');
    }
    this.variants.delete(variantId);
  }

  getVariantById(variantId: string): ProductVariant | undefined {
    return this.variants.get(variantId);
  }

  getVariantBySKU(sku: string): ProductVariant | undefined {
    return Array.from(this.variants.values()).find(
      (v) => v.getSKU().getValue() === sku,
    );
  }

  getAllVariants(): ProductVariant[] {
    return Array.from(this.variants.values());
  }

  updateBasicInfo(name: string, description: string): void {
    this.name = name;
    this.description = description;
  }

  publish(): void {
    if (this.variants.size === 0) {
      throw new DomainException('Cannot publish product without variants');
    }
    this.status = ProductStatus.ACTIVE;
  }

  discontinue(): void {
    this.status = ProductStatus.DISCONTINUED;
    this.variants.forEach((v) => v.deactivate());
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getCategoryId(): string {
    return this.categoryId;
  }

  getStatus(): ProductStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
      status: this.status,
      createdAt: this.createdAt,
      variants: this.getAllVariants().map((v) => v.toJSON()),
    };
  }
}
