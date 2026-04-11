import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand) {
    const user = this.eventPublisher.mergeObjectContext(
      UserAggregate.create(command.userId),
    );

    await this.userRepository.save(user);
    user.commit();

    return user.toJSON();
  }
}
