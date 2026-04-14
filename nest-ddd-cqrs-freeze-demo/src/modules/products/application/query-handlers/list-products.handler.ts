import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Permission } from '../../../auth/constants/permissions';
import { ensurePermission } from '../../../auth/utils/authorization.util';
import { ListProductsQuery } from '../queries/list-products.query';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../domain/repositories/product.repository';

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<ListProductsQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: ListProductsQuery) {
    ensurePermission(query.actorPermissions, Permission.PRODUCTS.READ);

    if (query.categoryId) {
      const products = await this.productRepository.findByCategoryId(
        query.categoryId,
      );
      return products.map((p) => p.toJSON());
    }

    const products = await this.productRepository.findAll();
    return products.map((p) => p.toJSON());
  }
}
