import { Injectable } from '@nestjs/common';
import { ProductAggregate, ProductStatus } from '../../domain/aggregates/product.aggregate';
import { ProductVariant } from '../../domain/value-objects/variant.vo';
import { Price } from '../../domain/value-objects/price.vo';
import { ProductRepository } from '../../domain/repositories/product.repository';

interface ProductSnapshot {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  status: ProductStatus;
  createdAt: Date;
  variants: VariantSnapshot[];
}

interface VariantSnapshot {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: { amount: number; currency: string };
  stockQuantity: number;
  isActive: boolean;
}

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private readonly products = new Map<string, ProductSnapshot>();

  async save(product: ProductAggregate): Promise<void> {
    this.products.set(product.getId(), {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      categoryId: product.getCategoryId(),
      status: product.getStatus(),
      createdAt: product.getCreatedAt(),
      variants: product.getAllVariants().map((v) => ({
        id: v.getId(),
        sku: v.getSKU().getValue(),
        attributes: v.getAttributes(),
        price: v.getPrice().toJSON(),
        stockQuantity: v.getStockQuantity(),
        isActive: v.isVariantActive(),
      })),
    });
  }

  async findById(id: string): Promise<ProductAggregate | null> {
    const snapshot = this.products.get(id);
    if (!snapshot) return null;

    return this.rehydrate(snapshot);
  }

  async findByCategoryId(categoryId: string): Promise<ProductAggregate[]> {
    return Array.from(this.products.values())
      .filter((p) => p.categoryId === categoryId)
      .map((p) => this.rehydrate(p));
  }

  async findAll(): Promise<ProductAggregate[]> {
    return Array.from(this.products.values()).map((p) => this.rehydrate(p));
  }

  async clear(): Promise<void> {
    this.products.clear();
  }

  private rehydrate(snapshot: ProductSnapshot): ProductAggregate {
    const variants = snapshot.variants.map((v) =>
      ProductVariant.rehydrate(
        v.id,
        v.sku,
        v.attributes,
        new Price(v.price.amount, v.price.currency),
        v.stockQuantity,
        v.isActive,
      ),
    );

    return ProductAggregate.rehydrate(
      snapshot.id,
      snapshot.name,
      snapshot.description,
      snapshot.categoryId,
      snapshot.status,
      snapshot.createdAt,
      variants,
    );
  }
}
