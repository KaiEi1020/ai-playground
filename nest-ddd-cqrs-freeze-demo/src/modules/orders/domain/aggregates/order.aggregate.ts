import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { DomainException } from '../../../../common/domain.exception';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderStartedEvent } from '../events/order-started.event';
import { OrderStoppedEvent } from '../events/order-stopped.event';
import { OrderItem } from '../value-objects/order-item.vo';
import { ShippingAddress } from '../value-objects/shipping-address.vo';

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
    private readonly items: OrderItem[],
    private readonly shippingAddress: ShippingAddress | null,
    private status: OrderStatus,
    private stopReason: string | null,
  ) {
    super();
  }

  static create(
    userId: string,
    items: OrderItem[] = [],
    shippingAddress: ShippingAddress | null = null,
    id?: string,
  ): OrderAggregate {
    const nextId = id ?? randomUUID();
    const order = new OrderAggregate(
      nextId,
      userId,
      items,
      shippingAddress,
      OrderStatus.CREATED,
      null,
    );
    order.apply(new OrderCreatedEvent(order.id, order.userId));
    return order;
  }

  static rehydrate(
    id: string,
    userId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress | null,
    status: OrderStatus,
    stopReason: string | null,
  ): OrderAggregate {
    return new OrderAggregate(id, userId, items, shippingAddress, status, stopReason);
  }

  start(): void {
    if (this.status !== OrderStatus.CREATED) {
      throw new DomainException(`Order ${this.id} cannot start from ${this.status}.`);
    }
    if (this.items.length === 0) {
      throw new DomainException(`Order ${this.id} must contain at least one item.`);
    }
    if (!this.shippingAddress) {
      throw new DomainException(`Order ${this.id} must have shipping address.`);
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

  getItems(): OrderItem[] {
    return this.items;
  }

  getShippingAddress(): ShippingAddress | null {
    return this.shippingAddress;
  }

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
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
      items: this.items.map((item) => item.toJSON()),
      shippingAddress: this.shippingAddress?.toJSON() ?? null,
      totalAmount: this.getTotalAmount(),
      status: this.status,
      stopReason: this.stopReason,
    };
  }
}
