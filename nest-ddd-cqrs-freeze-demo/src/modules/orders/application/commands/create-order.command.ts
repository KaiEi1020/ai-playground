export interface CreateOrderItemPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface ShippingAddressPayload {
  receiverName: string;
  phoneNumber: string;
  province: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
}

export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly items: CreateOrderItemPayload[],
    public readonly shippingAddress: ShippingAddressPayload,
    public readonly orderId?: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
