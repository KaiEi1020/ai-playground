import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Permission } from '../../../auth/constants/permissions';
import { ensurePermission } from '../../../auth/utils/authorization.util';
import { GetProductQuery } from '../queries/get-product.query';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../domain/repositories/product.repository';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery) {
    ensurePermission(query.actorPermissions, Permission.PRODUCTS.READ);

    const product = await this.productRepository.findById(query.productId);
    if (!product) {
      throw new NotFoundException(`Product ${query.productId} not found`);
    }

    return product.toJSON();
  }
}
