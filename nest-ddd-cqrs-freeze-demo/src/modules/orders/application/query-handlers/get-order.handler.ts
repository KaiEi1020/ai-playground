import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
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
    const order = await this.orderRepository.findById(query.orderId);
    if (!order) {
      throw new NotFoundException(`Order ${query.orderId} not found.`);
    }

    return order.toJSON();
  }
}
