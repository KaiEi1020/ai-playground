export class StartOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
