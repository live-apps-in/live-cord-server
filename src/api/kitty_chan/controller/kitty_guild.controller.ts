import { Controller, Get, Inject, Request, Param, Patch } from '@nestjs/common';
import { GUILD_ACTIONS } from 'src/api/kitty_chan/enum/kitty_guild_actions';
import { EditKittyGuildAdminDto } from 'src/api/kitty_chan/_dto/KittyGuildAdmin.dto';
import { KittyGuildService } from 'src/api/kitty_chan/service/kitty_guild.service';
import { Req } from 'src/core/custom_types';

@Controller('kitty_chan/guild')
export class KittyGuildController {
  constructor(
    @Inject(KittyGuildService) private readonly guildService: KittyGuildService,
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
    const editGuildAdminPayload = new EditKittyGuildAdminDto(
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

  //**Emoji */
  @Get('/:guildId/emojis')
  async getGuildEmojis(@Param('guildId') guildId: string, @Request() req: Req) {
    const { userId } = req.userData;
    return this.guildService.getGuildEmojis(userId, guildId);
  }
}
