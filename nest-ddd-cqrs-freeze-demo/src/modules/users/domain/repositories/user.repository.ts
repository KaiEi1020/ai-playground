import { UserAggregate } from '../aggregates/user.aggregate';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  save(user: UserAggregate): Promise<void>;
  findById(id: string): Promise<UserAggregate | null>;
  clear(): Promise<void>;
}
