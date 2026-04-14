import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '../auth/constants/permissions';
import { ensurePermission } from '../auth/utils/authorization.util';
import {
  USER_REPOSITORY,
  UserRepository,
} from './domain/repositories/user.repository';

@Injectable()
export class UserFacade {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async getUser(id: string, actorPermissions: string[]) {
    ensurePermission(actorPermissions, Permission.USERS.READ);

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found.`);
    }

    return user.toJSON();
  }

  async reset(): Promise<void> {
    await this.userRepository.clear();
  }
}
