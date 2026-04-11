import {
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../common/domain.exception';
import { StopOrderCommand } from '../commands/stop-order.command';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';

@CommandHandler(StopOrderCommand)
export class StopOrderHandler implements ICommandHandler<StopOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: StopOrderCommand) {
    const existingOrder = await this.orderRepository.findById(command.orderId);
    if (!existingOrder) {
      throw new NotFoundException(`Order ${command.orderId} not found.`);
    }

    const order = this.eventPublisher.mergeObjectContext(existingOrder);

    try {
      order.stop(command.reason);
    } catch (error) {
      if (error instanceof DomainException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    await this.orderRepository.save(order);
    order.commit();

    return order.toJSON();
  }
}
