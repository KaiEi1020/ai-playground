import {
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../common/domain.exception';
import { FreezeUserAccountCommand } from '../commands/freeze-user-account.command';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';

@CommandHandler(FreezeUserAccountCommand)
export class FreezeUserAccountHandler
  implements ICommandHandler<FreezeUserAccountCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: FreezeUserAccountCommand) {
    const existingUser = await this.userRepository.findById(command.userId);
    if (!existingUser) {
      throw new NotFoundException(`User ${command.userId} not found.`);
    }

    const user = this.eventPublisher.mergeObjectContext(existingUser);

    try {
      user.freeze();
    } catch (error) {
      if (error instanceof DomainException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    await this.userRepository.save(user);
    user.commit();

    return user.toJSON();
  }
}
