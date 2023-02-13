import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { Types } from 'mongoose';
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
   * @param {string} channelId - Discord channelId
   */
  ///Set Reaction Role Channel
  @Patch('/:guildId/reaction_roles/channel/:channelId')
  async setReactionRoleChannel(
    @Param('channelId') channelId: string,
    @Param('guildId') guildId: string,
  ) {
    return await this.kittyRolesService.setReactionRoleChannel(
      channelId,
      guildId,
    );
  }
  @Post('/:guildId/reaction_roles')
  async createReactionRoles(@Body() reqBody: any) {
    return await this.kittyRolesService.createReactionRoles(reqBody);
  }

  @Get('/:guildId/reaction_roles')
  async getReactionRoles(@Param('guildId') guildId: string) {
    return await this.kittyRolesService.getReactionRoles(guildId);
  }

  ///Reaction Role Actions
  @Patch('/:guildId/reaction_roles/:reaction_role_id/:action')
  async reaction_role_actions(
    @Param('guildId') guildId: string,
    @Param('reaction_roles_id') reaction_role_id: any,
    @Param('action') action: string,
  ) {
    reaction_role_id = new Types.ObjectId(reaction_role_id);
    return await this.kittyRolesService.reactionRolesAction(
      reaction_role_id,
      guildId,
      action,
    );
  }
}
