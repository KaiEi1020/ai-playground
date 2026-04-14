export class GetProductQuery {
  constructor(
    public readonly productId: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
