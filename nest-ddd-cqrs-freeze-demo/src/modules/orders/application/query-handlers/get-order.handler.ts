import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Permission } from '../../../auth/constants/permissions';
import { ensurePermission } from '../../../auth/utils/authorization.util';
import { GetOrderQuery } from '../queries/get-order.query';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: GetOrderQuery) {
    ensurePermission(query.actorPermissions, Permission.ORDERS.READ);

    const order = await this.orderRepository.findById(query.orderId);
    if (!order) {
      throw new NotFoundException(`Order ${query.orderId} not found.`);
    }

    return order.toJSON();
  }
}
