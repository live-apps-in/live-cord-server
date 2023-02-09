import { Controller, Get, Inject, Request, Param, Patch } from '@nestjs/common';
import { GUILD_ACTIONS } from 'src/api/guild/enum/guild_actions';
import { GuildService } from 'src/api/guild/service/guild.service';
import { EditGuildAdminDto } from 'src/api/guild/_dto/GuildAdmin.dto';
import { KittyGuildService } from 'src/api/kitty_chan/service/kitty_guild.service';
import { Req } from 'src/core/custom_types';

@Controller('guild')
export class GuildController {
  constructor(
    @Inject(GuildService) private readonly guildService: GuildService,
    @Inject(KittyGuildService)
    private readonly guildConfigService: KittyGuildService,
  ) {}

  ///View Guild of a User
  @Get('')
  async view_guilds(@Request() req: Req) {
    const { userId } = req.userData;
    return await this.guildService.get_guild_by_userId(userId);
  }

  ///View Guild Profile
  @Get('/:guildId/profile')
  async guild_profile(@Request() req: Req, @Param() params: any) {
    const { userId } = req.userData;
    return await this.guildConfigService.getProfile(userId, params.guildId);
  }

  //**Admin**//
  //Add or remove admin from guild
  @Patch('/:guildId/admin/:adminId/:action')
  async guid_admin(@Request() req: Req, @Param() params: any) {
    const { userId } = req.userData;
    const { guildId, adminId, action } = params;

    ///Build and Validate Payload
    const editGuildAdminPayload = new EditGuildAdminDto(
      guildId,
      userId,
      adminId,
      action as GUILD_ACTIONS,
    );
    editGuildAdminPayload.validateAction();

    return await this.guildService.edit_guild_admin(editGuildAdminPayload);
  }

  //**Features**//
  @Patch('/features')
  async edit_guild_feature(@Request() req: Req) {
    const { userId } = req.userData;
    const { guildId, features } = req.body;

    return await this.guildConfigService.edit_guild_feature(
      userId,
      guildId,
      features,
    );
  }
}
