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
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderCommand } from '../application/commands/create-order.command';
import { StartOrderCommand } from '../application/commands/start-order.command';
import { GetOrderQuery } from '../application/queries/get-order.query';
import { ListOrdersByUserQuery } from '../application/queries/list-orders-by-user.query';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permission.ORDERS.CREATE)
  async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(
      new CreateOrderCommand(
        dto.userId,
        dto.items,
        dto.shippingAddress,
        dto.id,
        user.permissions,
      ),
    );
  }

  @Post(':id/start')
  @RequirePermissions(Permission.ORDERS.START)
  async startOrder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(new StartOrderCommand(id, user.permissions));
  }

  @Get(':id')
  @RequirePermissions(Permission.ORDERS.READ)
  async getOrder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.queryBus.execute(new GetOrderQuery(id, user.permissions));
  }

  @Get()
  @RequirePermissions(Permission.ORDERS.READ)
  async listOrders(
    @Query('userId', new ParseUUIDPipe()) userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.queryBus.execute(
      new ListOrdersByUserQuery(userId, user.permissions),
    );
  }
}
