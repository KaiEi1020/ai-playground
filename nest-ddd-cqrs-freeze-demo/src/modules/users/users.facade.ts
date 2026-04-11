import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async getUser(id: string) {
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
