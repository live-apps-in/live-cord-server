import { Controller, Get, Inject, Param } from '@nestjs/common';
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

  @Get('/:guildId/roles')
  async getRoles(@Param('guildId') guildId: string) {
    return await this.kittyRolesService.getAllRoles(guildId);
  }
}
