export class OrderStartedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
  ) {}
}
