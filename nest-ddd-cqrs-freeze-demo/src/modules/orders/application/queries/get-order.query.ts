export class GetOrderQuery {
  constructor(
    public readonly orderId: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
