import {
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository, USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderAggregate } from '../../domain/aggregates/order.aggregate';
import { ORDER_REPOSITORY, OrderRepository } from '../../domain/repositories/order.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateOrderCommand) {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException(`User ${command.userId} not found.`);
    }

    const order = this.eventPublisher.mergeObjectContext(
      OrderAggregate.create(command.userId, command.orderId),
    );

    await this.orderRepository.save(order);
    order.commit();

    return order.toJSON();
  }
}
