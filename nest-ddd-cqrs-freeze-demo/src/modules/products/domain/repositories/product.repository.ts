import { ProductAggregate } from '../aggregates/product.aggregate';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  save(product: ProductAggregate): Promise<void>;
  findById(id: string): Promise<ProductAggregate | null>;
  findByCategoryId(categoryId: string): Promise<ProductAggregate[]>;
  findAll(): Promise<ProductAggregate[]>;
  clear(): Promise<void>;
}
