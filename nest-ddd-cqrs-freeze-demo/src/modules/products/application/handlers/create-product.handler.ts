import { Inject, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Permission } from '../../../auth/constants/permissions';
import { ensurePermission } from '../../../auth/utils/authorization.util';
import { CreateProductCommand } from '../commands/create-product.command';
import { ProductAggregate } from '../../domain/aggregates/product.aggregate';
import { Price } from '../../domain/value-objects/price.vo';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../domain/repositories/product.repository';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand) {
    ensurePermission(command.actorPermissions, Permission.PRODUCTS.CREATE);

    const product = ProductAggregate.create(
      command.name,
      command.description,
      command.categoryId,
    );

    for (const variantDto of command.variants) {
      product.addVariant(
        variantDto.sku,
        variantDto.attributes,
        new Price(variantDto.price.amount, variantDto.price.currency ?? 'CNY'),
        variantDto.stockQuantity,
      );
    }

    await this.productRepository.save(product);

    return product.toJSON();
  }
}
