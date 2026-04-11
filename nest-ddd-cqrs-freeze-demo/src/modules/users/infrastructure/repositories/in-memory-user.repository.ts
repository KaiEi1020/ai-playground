import { Injectable } from '@nestjs/common';
import { UserAggregate, UserStatus } from '../../domain/aggregates/user.aggregate';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, { id: string; status: UserStatus }>();

  async save(user: UserAggregate): Promise<void> {
    this.users.set(user.getId(), {
      id: user.getId(),
      status: user.getStatus(),
    });
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    return UserAggregate.rehydrate(user.id, user.status);
  }

  async clear(): Promise<void> {
    this.users.clear();
  }
}
