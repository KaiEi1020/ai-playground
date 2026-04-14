import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Permission } from '../../../auth/constants/permissions';
import { ensurePermission } from '../../../auth/utils/authorization.util';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../products/domain/repositories/product.repository';
import { UserRepository, USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import { CreateOrderCommand } from '../commands/create-order.command';
import { ORDER_REPOSITORY, OrderRepository } from '../../domain/repositories/order.repository';
import {
  ORDER_CREATION_SERVICE,
  OrderCreationService,
} from '../../domain/services/order-creation.service';
import { ShippingAddress } from '../../domain/value-objects/shipping-address.vo';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(ORDER_CREATION_SERVICE)
    private readonly orderCreationService: OrderCreationService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateOrderCommand) {
    ensurePermission(command.actorPermissions, Permission.ORDERS.CREATE);

    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException(`User ${command.userId} not found.`);
    }

    const items = [];

    for (const item of command.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found.`);
      }

      const variant = product.getVariantById(item.variantId);
      if (!variant) {
        throw new NotFoundException(`Variant ${item.variantId} not found.`);
      }

      items.push({
        productId: product.getId(),
        variantId: variant.getId(),
        productName: product.getName(),
        sku: variant.getSKU().getValue(),
        unitPrice: variant.getPrice().getAmount(),
        quantity: item.quantity,
        availableStock: variant.getStockQuantity(),
        isActive: variant.isVariantActive(),
      });
    }

    const shippingAddress = new ShippingAddress(
      command.shippingAddress.receiverName,
      command.shippingAddress.phoneNumber,
      command.shippingAddress.province,
      command.shippingAddress.city,
      command.shippingAddress.district,
      command.shippingAddress.street,
      command.shippingAddress.postalCode,
    );

    const order = this.eventPublisher.mergeObjectContext(
      this.orderCreationService.createOrder({
        userId: command.userId,
        userStatus: user.getStatus(),
        items,
        shippingAddress,
        orderId: command.orderId,
      }),
    );

    await this.orderRepository.save(order);
    order.commit();

    return order.toJSON();
  }
}
