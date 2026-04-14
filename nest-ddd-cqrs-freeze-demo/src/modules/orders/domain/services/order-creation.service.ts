import { OrderAggregate } from '../aggregates/order.aggregate';
import { ShippingAddress } from '../value-objects/shipping-address.vo';

export const ORDER_CREATION_SERVICE = Symbol('ORDER_CREATION_SERVICE');

export interface OrderCreationItemInput {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  availableStock: number;
  isActive: boolean;
}

export interface OrderCreationInput {
  userId: string;
  userStatus: 'ACTIVE' | 'FROZEN';
  items: OrderCreationItemInput[];
  shippingAddress: ShippingAddress;
  orderId?: string;
}

export interface OrderCreationService {
  createOrder(input: OrderCreationInput): OrderAggregate;
}
