import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../common/domain.exception';
import { OrderAggregate } from '../aggregates/order.aggregate';
import { OrderItem } from '../value-objects/order-item.vo';
import {
  OrderCreationInput,
  OrderCreationService,
} from './order-creation.service';

@Injectable()
export class OrderCreationServiceImpl implements OrderCreationService {
  createOrder(input: OrderCreationInput): OrderAggregate {
    this.validateUserStatus(input.userStatus);
    this.validateItems(input.items);

    const orderItems = input.items.map(
      (item) =>
        new OrderItem(
          item.productId,
          item.variantId,
          item.productName,
          item.sku,
          item.unitPrice,
          item.quantity,
        ),
    );

    return OrderAggregate.create(
      input.userId,
      orderItems,
      input.shippingAddress,
      input.orderId,
    );
  }

  private validateUserStatus(userStatus: 'ACTIVE' | 'FROZEN'): void {
    if (userStatus === 'FROZEN') {
      throw new DomainException('Cannot create order for frozen user');
    }
  }

  private validateItems(
    items: OrderCreationInput['items'],
  ): void {
    if (items.length === 0) {
      throw new DomainException('Order must contain at least one item');
    }

    for (const item of items) {
      if (!item.isActive) {
        throw new DomainException(
          `Product variant ${item.variantId} is not available for ordering`,
        );
      }

      if (item.quantity > item.availableStock) {
        throw new DomainException(
          `Insufficient stock for product ${item.productId}, variant ${item.variantId}. ` +
            `Requested: ${item.quantity}, Available: ${item.availableStock}`,
        );
      }
    }
  }
}
