export class CreateUserCommand {
  constructor(
    public readonly userId?: string,
    public readonly actorPermissions: string[] = [],
  ) {}
}
