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
