import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from './domain/repositories/order.repository';

@Injectable()
export class OrdersFacade {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async reset(): Promise<void> {
    await this.orderRepository.clear();
  }
}
