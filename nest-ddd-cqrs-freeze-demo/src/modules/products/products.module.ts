import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './api/products.controller';
import { CreateProductHandler } from './application/handlers/create-product.handler';
import { GetProductHandler } from './application/query-handlers/get-product.handler';
import { ListProductsHandler } from './application/query-handlers/list-products.handler';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory-product.repository';

const commandHandlers = [CreateProductHandler];
const queryHandlers = [GetProductHandler, ListProductsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    InMemoryProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: InMemoryProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
