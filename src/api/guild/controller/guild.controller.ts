import { Controller, Get, Inject, Request, Param, Patch } from '@nestjs/common';
import { GuildService } from 'src/api/guild/service/guild.service';
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
