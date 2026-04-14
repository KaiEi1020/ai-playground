import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsArray()
  variants!: Array<{
    sku: string;
    attributes: Record<string, string>;
    price: { amount: number; currency?: string };
    stockQuantity: number;
  }>;
}
