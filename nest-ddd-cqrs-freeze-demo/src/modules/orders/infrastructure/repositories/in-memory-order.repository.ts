import { Injectable } from '@nestjs/common';
import { OrderAggregate, OrderStatus } from '../../domain/aggregates/order.aggregate';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderItem } from '../../domain/value-objects/order-item.vo';
import { ShippingAddress } from '../../domain/value-objects/shipping-address.vo';

interface OrderSnapshot {
  id: string;
  userId: string;
  items: {
    productId: string;
    variantId: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
  }[];
  shippingAddress: {
    receiverName: string;
    phoneNumber: string;
    province: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
  } | null;
  status: OrderStatus;
  stopReason: string | null;
}

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, OrderSnapshot>();

  async save(order: OrderAggregate): Promise<void> {
    this.orders.set(order.getId(), {
      id: order.getId(),
      userId: order.getUserId(),
      items: order.getItems().map((item) => ({
        productId: item.getProductId(),
        variantId: item.getVariantId(),
        productName: item.getProductName(),
        sku: item.getSku(),
        unitPrice: item.getUnitPrice(),
        quantity: item.getQuantity(),
      })),
      shippingAddress: order.getShippingAddress()?.toJSON() ?? null,
      status: order.getStatus(),
      stopReason: order.getStopReason(),
    });
  }

  async findById(id: string): Promise<OrderAggregate | null> {
    const order = this.orders.get(id);
    if (!order) {
      return null;
    }

    return this.rehydrate(order);
  }

  async findByUserId(userId: string): Promise<OrderAggregate[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .map((order) => this.rehydrate(order));
  }

  async findInProgressByUserId(userId: string): Promise<OrderAggregate[]> {
    return Array.from(this.orders.values())
      .filter(
        (order) =>
          order.userId === userId && order.status === OrderStatus.IN_PROGRESS,
      )
      .map((order) => this.rehydrate(order));
  }

  async clear(): Promise<void> {
    this.orders.clear();
  }

  private rehydrate(snapshot: OrderSnapshot): OrderAggregate {
    return OrderAggregate.rehydrate(
      snapshot.id,
      snapshot.userId,
      snapshot.items.map(
        (item) =>
          new OrderItem(
            item.productId,
            item.variantId,
            item.productName,
            item.sku,
            item.unitPrice,
            item.quantity,
          ),
      ),
      snapshot.shippingAddress
        ? new ShippingAddress(
            snapshot.shippingAddress.receiverName,
            snapshot.shippingAddress.phoneNumber,
            snapshot.shippingAddress.province,
            snapshot.shippingAddress.city,
            snapshot.shippingAddress.district,
            snapshot.shippingAddress.street,
            snapshot.shippingAddress.postalCode,
          )
        : null,
      snapshot.status,
      snapshot.stopReason,
    );
  }
}
