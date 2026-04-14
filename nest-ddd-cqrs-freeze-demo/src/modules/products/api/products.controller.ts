import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permission } from '../../auth/constants/permissions';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.interface';
import { CreateProductCommand } from '../application/commands/create-product.command';
import { GetProductQuery } from '../application/queries/get-product.query';
import { ListProductsQuery } from '../application/queries/list-products.query';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permission.PRODUCTS.CREATE)
  async createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(
      new CreateProductCommand(
        dto.name,
        dto.description,
        dto.categoryId,
        dto.variants,
        user.permissions,
      ),
    );
  }

  @Get(':id')
  @RequirePermissions(Permission.PRODUCTS.READ)
  async getProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.queryBus.execute(new GetProductQuery(id, user.permissions));
  }

  @Get()
  @RequirePermissions(Permission.PRODUCTS.READ)
  async listProducts(
    @Query('categoryId') categoryId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.queryBus.execute(
      new ListProductsQuery(categoryId, user.permissions),
    );
  }
}
