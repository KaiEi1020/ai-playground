import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersModule } from '../orders/orders.module';
import { UsersController } from './api/users.controller';
import { CreateUserHandler } from './application/handlers/create-user.handler';
import { FreezeUserAccountHandler } from './application/handlers/freeze-user-account.handler';
import { UserFreezeSaga } from './application/sagas/user-freeze.saga';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { UserFacade } from './users.facade';

const commandHandlers = [CreateUserHandler, FreezeUserAccountHandler];
const sagas = [UserFreezeSaga];

@Module({
  imports: [CqrsModule, forwardRef(() => OrdersModule)],
  controllers: [UsersController],
  providers: [
    ...commandHandlers,
    ...sagas,
    UserFacade,
    InMemoryUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: InMemoryUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, UserFacade],
})
export class UsersModule {}
