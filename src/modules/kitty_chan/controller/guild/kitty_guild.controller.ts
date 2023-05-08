import { Controller, Get, Inject, Request, Param, Patch } from '@nestjs/common';
import { KittyGuildService } from 'src/modules/kitty_chan/service/kitty_guild.service';
import { Req } from 'src/core/custom_types';

@Controller('kitty_chan/guild')
export class KittyGuildController {
  constructor(
    @Inject(KittyGuildService) private readonly guildService: KittyGuildService,
    @Inject(KittyGuildService)
    private readonly guildConfigService: KittyGuildService,
  ) {}

  ///View Guilds of a User
  @Get('')
  async view_guilds(@Request() req: Req) {
    const { userId } = req.userData;
    return this.guildService.getAllUserGuilds(userId);
  }

  ///View Guild Profile
  @Get('/:guildId/profile')
  async guild_profile(@Request() req: Req, @Param() params: any) {
    const { userId } = req.userData;
    return await this.guildConfigService.getProfile(userId, params.guildId);
  }

  ///View Guild Profile
  @Get('/:guildId/channels')
  async guild_channels(@Request() req: Req, @Param() params: any) {
    const { userId } = req.userData;
    return await this.guildConfigService.getChannels(userId, params.guildId);
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
