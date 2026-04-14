export class ListOrdersByUserQuery {
  constructor(
    public readonly userId: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
