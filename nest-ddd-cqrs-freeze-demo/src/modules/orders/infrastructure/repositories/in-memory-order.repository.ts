import { Injectable } from '@nestjs/common';
import { OrderAggregate, OrderStatus } from '../../domain/aggregates/order.aggregate';
import { OrderRepository } from '../../domain/repositories/order.repository';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<
    string,
    { id: string; userId: string; status: OrderStatus; stopReason: string | null }
  >();

  async save(order: OrderAggregate): Promise<void> {
    this.orders.set(order.getId(), {
      id: order.getId(),
      userId: order.getUserId(),
      status: order.getStatus(),
      stopReason: order.getStopReason(),
    });
  }

  async findById(id: string): Promise<OrderAggregate | null> {
    const order = this.orders.get(id);
    if (!order) {
      return null;
    }

    return OrderAggregate.rehydrate(
      order.id,
      order.userId,
      order.status,
      order.stopReason,
    );
  }

  async findByUserId(userId: string): Promise<OrderAggregate[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .map((order) =>
        OrderAggregate.rehydrate(
          order.id,
          order.userId,
          order.status,
          order.stopReason,
        ),
      );
  }

  async findInProgressByUserId(userId: string): Promise<OrderAggregate[]> {
    return Array.from(this.orders.values())
      .filter(
        (order) =>
          order.userId === userId && order.status === OrderStatus.IN_PROGRESS,
      )
      .map((order) =>
        OrderAggregate.rehydrate(
          order.id,
          order.userId,
          order.status,
          order.stopReason,
        ),
      );
  }

  async clear(): Promise<void> {
    this.orders.clear();
  }
}
