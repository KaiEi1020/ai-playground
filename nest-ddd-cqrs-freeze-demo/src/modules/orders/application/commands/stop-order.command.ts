export class StopOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly reason: string,
  ) {}
}
