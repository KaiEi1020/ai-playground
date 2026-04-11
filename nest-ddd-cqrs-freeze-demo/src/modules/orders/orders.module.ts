import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './api/orders.controller';
import { CreateOrderHandler } from './application/handlers/create-order.handler';
import { StartOrderHandler } from './application/handlers/start-order.handler';
import { StopOrderHandler } from './application/handlers/stop-order.handler';
import { GetOrderHandler } from './application/query-handlers/get-order.handler';
import { ListOrdersByUserHandler } from './application/query-handlers/list-orders-by-user.handler';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { InMemoryOrderRepository } from './infrastructure/repositories/in-memory-order.repository';
import { OrdersFacade } from './orders.facade';

const commandHandlers = [
  CreateOrderHandler,
  StartOrderHandler,
  StopOrderHandler,
];
const queryHandlers = [GetOrderHandler, ListOrdersByUserHandler];

@Module({
  imports: [CqrsModule, forwardRef(() => UsersModule)],
  controllers: [OrdersController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    OrdersFacade,
    InMemoryOrderRepository,
    {
      provide: ORDER_REPOSITORY,
      useExisting: InMemoryOrderRepository,
    },
  ],
  exports: [ORDER_REPOSITORY, OrdersFacade],
})
export class OrdersModule {}
