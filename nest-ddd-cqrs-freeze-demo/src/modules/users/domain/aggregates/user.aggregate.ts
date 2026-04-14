import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { DomainException } from '../../../../common/domain.exception';
import { UserAccountFrozenEvent } from '../events/user-account-frozen.event';
import { UserCreatedEvent } from '../events/user-created.event';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
}

export class UserAggregate extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private status: UserStatus,
  ) {
    super();
  }

  static create(id?: string): UserAggregate {
    const nextId = id ?? randomUUID();
    const user = new UserAggregate(nextId, UserStatus.ACTIVE);
    user.apply(new UserCreatedEvent(user.id));
    return user;
  }

  static rehydrate(id: string, status: UserStatus): UserAggregate {
    return new UserAggregate(id, status);
  }

  freeze(): void {
    if (this.status === UserStatus.FROZEN) {
      throw new DomainException(`User ${this.id} is already frozen.`);
    }

    this.status = UserStatus.FROZEN;
    this.apply(new UserAccountFrozenEvent(this.id));
  }

  getId(): string {
    return this.id;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  toJSON() {
    return {
      id: this.id,
      status: this.status,
    };
  }
}
