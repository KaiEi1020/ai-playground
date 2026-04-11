import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { DomainException } from '../../../../common/domain.exception';
import { OrderCreatedEvent } from '../../application/events/order-created.event';
import { OrderStartedEvent } from '../../application/events/order-started.event';
import { OrderStoppedEvent } from '../../application/events/order-stopped.event';

export enum OrderStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  STOPPED = 'STOPPED',
  COMPLETED = 'COMPLETED',
}

export class OrderAggregate extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private status: OrderStatus,
    private stopReason: string | null,
  ) {
    super();
  }

  static create(userId: string, id?: string): OrderAggregate {
    const nextId = id ?? randomUUID();
    const order = new OrderAggregate(nextId, userId, OrderStatus.CREATED, null);
    order.apply(new OrderCreatedEvent(order.id, order.userId));
    return order;
  }

  static rehydrate(
    id: string,
    userId: string,
    status: OrderStatus,
    stopReason: string | null,
  ): OrderAggregate {
    return new OrderAggregate(id, userId, status, stopReason);
  }

  start(): void {
    if (this.status !== OrderStatus.CREATED) {
      throw new DomainException(`Order ${this.id} cannot start from ${this.status}.`);
    }

    this.status = OrderStatus.IN_PROGRESS;
    this.apply(new OrderStartedEvent(this.id, this.userId));
  }

  stop(reason: string): void {
    if (this.status !== OrderStatus.IN_PROGRESS) {
      throw new DomainException(`Order ${this.id} cannot stop from ${this.status}.`);
    }

    this.status = OrderStatus.STOPPED;
    this.stopReason = reason;
    this.apply(new OrderStoppedEvent(this.id, this.userId, reason));
  }

  complete(): void {
    if (this.status !== OrderStatus.IN_PROGRESS) {
      throw new DomainException(`Order ${this.id} cannot complete from ${this.status}.`);
    }

    this.status = OrderStatus.COMPLETED;
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getStopReason(): string | null {
    return this.stopReason;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      status: this.status,
      stopReason: this.stopReason,
    };
  }
}
