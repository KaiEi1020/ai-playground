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
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.commandBus.execute(new CreateOrderCommand(dto.userId, dto.id));
  }

  @Post(':id/start')
  async startOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commandBus.execute(new StartOrderCommand(id));
  }

  @Get(':id')
  async getOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.queryBus.execute(new GetOrderQuery(id));
  }

  @Get()
  async listOrders(@Query('userId', new ParseUUIDPipe()) userId: string) {
    return this.queryBus.execute(new ListOrdersByUserQuery(userId));
  }
}
