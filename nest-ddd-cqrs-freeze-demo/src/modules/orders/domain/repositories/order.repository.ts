import { OrderAggregate } from '../aggregates/order.aggregate';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepository {
  save(order: OrderAggregate): Promise<void>;
  findById(id: string): Promise<OrderAggregate | null>;
  findByUserId(userId: string): Promise<OrderAggregate[]>;
  findInProgressByUserId(userId: string): Promise<OrderAggregate[]>;
  clear(): Promise<void>;
}
