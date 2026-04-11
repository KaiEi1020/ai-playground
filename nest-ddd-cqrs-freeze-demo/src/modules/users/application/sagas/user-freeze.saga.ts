import { Inject, Injectable } from '@nestjs/common';
import { IEvent, Saga, ofType } from '@nestjs/cqrs';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserAccountFrozenEvent } from '../events/user-account-frozen.event';
import { StopOrderCommand } from '../../../orders/application/commands/stop-order.command';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../../orders/domain/repositories/order.repository';

@Injectable()
export class UserFreezeSaga {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  @Saga()
  userFrozen = (events$: Observable<IEvent>): Observable<StopOrderCommand> => {
    return events$.pipe(
      ofType(UserAccountFrozenEvent),
      mergeMap((event) => from(this.toStopCommands(event))),
      mergeMap((commands) => from(commands)),
    );
  };

  private async toStopCommands(
    event: UserAccountFrozenEvent,
  ): Promise<StopOrderCommand[]> {
    const orders = await this.orderRepository.findInProgressByUserId(event.userId);
    return orders.map(
      (order) =>
        new StopOrderCommand(
          order.getId(),
          `Stopped because user ${event.userId} was frozen.`,
        ),
    );
  }
}
