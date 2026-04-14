export class FreezeUserAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
