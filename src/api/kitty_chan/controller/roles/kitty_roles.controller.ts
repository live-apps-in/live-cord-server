import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { KittyRolesService } from 'src/api/kitty_chan/service/roles/kitty_role.service';

/**
 * GuildAccess Middleware is used to validate permissions
 * @param { string } guildId
 */
@Controller('/kitty_chan/guild')
export class KittyRolesController {
  constructor(
    @Inject(KittyRolesService)
    private readonly kittyRolesService: KittyRolesService,
  ) {}

  ///Roles
  @Get('/:guildId/roles')
  async getRoles(@Param('guildId') guildId: string) {
    return await this.kittyRolesService.getAllRoles(guildId);
  }

  /**
   * Reaction Roles
   */
  @Post('/:guildId/reaction_roles')
  async createReactionRoles(@Body() reqBody: any) {
    return await this.kittyRolesService.createReactionRoles(reqBody);
  }

  @Get('/:guildId/reaction_roles')
  async getReactionRoles(@Param('guildId') guildId: string) {
    return await this.kittyRolesService.getReactionRoles(guildId);
  }

  ///Reaction Role Actions
  @Patch('/:guildId/reaction_roles/:reaction_roles_id/:action')
  async reaction_role_actions(
    @Param('reaction_roles_id') reaction_roles_id: string,
    @Param('action') action: string,
  ) {}
}
