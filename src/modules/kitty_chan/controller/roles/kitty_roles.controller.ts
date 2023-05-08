import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { Types } from 'mongoose';
import { KittyRolesService } from 'src/modules/kitty_chan/service/roles/kitty_role.service';

/**
 * GuildAccess Middleware is used to validate permissions
 * @param { string } guildId
 */
@Controller('/kitty_chan/guild/:guildId')
export class KittyRolesController {
  constructor(
    @Inject(KittyRolesService)
    private readonly kittyRolesService: KittyRolesService,
  ) {}

  /**
   * Create Reaction Roles in LiveCord
   */
  @Post('/reaction_roles')
  async createReactionRoles(@Body() reqBody: any) {
    return await this.kittyRolesService.createReactionRoles(reqBody);
  }

  /**
   * Get Reaction Roles from LiveCord
   */
  @Get('/reaction_roles')
  async getReactionRoles(@Param('guildId') guildId: string) {
    return await this.kittyRolesService.getReactionRoles(guildId);
  }

  /**
   * Call kitty chan service for Reaction Roles Action
   * @param { string } guildId
   * @param { Types.ObjectId } reaction_role_id
   * @param { string } action
   */
  @Patch('/reaction_roles/:reaction_role_id/:action')
  async reaction_role_actions(
    @Param('guildId') guildId: string,
    @Param('reaction_role_id') reaction_role_id: any,
    @Param('action') action: string,
  ) {
    reaction_role_id = new Types.ObjectId(reaction_role_id);
    return await this.kittyRolesService.reactionRolesAction(
      guildId,
      reaction_role_id,
      action,
    );
  }
}
