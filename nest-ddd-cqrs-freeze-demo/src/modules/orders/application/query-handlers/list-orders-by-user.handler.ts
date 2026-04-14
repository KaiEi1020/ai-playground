import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Permission } from '../../../auth/constants/permissions';
import { ensurePermission } from '../../../auth/utils/authorization.util';
import { ListOrdersByUserQuery } from '../queries/list-orders-by-user.query';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';

@QueryHandler(ListOrdersByUserQuery)
export class ListOrdersByUserHandler
  implements IQueryHandler<ListOrdersByUserQuery>
{
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: ListOrdersByUserQuery) {
    ensurePermission(query.actorPermissions, Permission.ORDERS.READ);

    const orders = await this.orderRepository.findByUserId(query.userId);
    return orders.map((order) => order.toJSON());
  }
}
