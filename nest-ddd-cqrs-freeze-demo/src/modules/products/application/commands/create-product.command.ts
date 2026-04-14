import { Price } from '../../domain/value-objects/price.vo';
import { VariantAttributes } from '../../domain/value-objects/variant.vo';

export interface CreateVariantDto {
  sku: string;
  attributes: VariantAttributes;
  price: { amount: number; currency?: string };
  stockQuantity: number;
}

export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly variants: CreateVariantDto[],
    public readonly actorPermissions: string[] = [],
  ) {}
}
