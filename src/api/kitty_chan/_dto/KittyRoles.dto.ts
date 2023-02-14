/**
 * Roles - Common Guild roles from Discord API
 */
export class KittyRolesDto {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public permissions: string,
  ) {}
}

/**
 * Reaction Roles - Custom Reaction Roles for Guild
 */
export class CreateKittyReactionRolesDto {
  constructor(
    public name: string,
    public rolesMapping: any[],
    public guildId: string,
  ) {}
}

export class KittyReactionRolesActionDto {
  constructor(
    public channelId: string,
    public action: string,
    public reaction_role_message_ref?: string,
    public rolesMapping?: any[],
  ) {}
}
