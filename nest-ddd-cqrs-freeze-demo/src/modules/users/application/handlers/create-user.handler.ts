import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Permission } from '../../../auth/constants/permissions';
import { ensurePermission } from '../../../auth/utils/authorization.util';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
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
    ensurePermission(command.actorPermissions, Permission.USERS.CREATE);

    const user = this.eventPublisher.mergeObjectContext(
      UserAggregate.create(command.userId),
    );

    await this.userRepository.save(user);
    user.commit();

    return user.toJSON();
  }
}
