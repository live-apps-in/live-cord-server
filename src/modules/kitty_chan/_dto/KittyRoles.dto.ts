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
    public channelId: string,
    public guildId: string,
    public rolesMapping: string[],
    public discordEmbedConfig: any[],
  ) {}
}

export class KittyReactionRolesActionDto {
  constructor(
    public name: string,
    public channelId: string,
    public action: string,
    public rolesMapping: string[],
    public reactionRoleMessageRef?: string,
    public discordEmbedConfig?: any[],
  ) {}
}
