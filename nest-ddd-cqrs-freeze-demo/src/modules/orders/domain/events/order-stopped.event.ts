export class OrderStoppedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly reason: string,
  ) {}
}
