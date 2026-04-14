export class ListProductsQuery {
  constructor(
    public readonly categoryId?: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
