import { Controller, Get, Inject, Request } from '@nestjs/common';
import { GuildService } from 'src/api/guild/service/guild.service';
import { Req } from 'src/core/custom_types';

@Controller('guild')
export class GuildController {
  constructor(
    @Inject(GuildService) private readonly guildService: GuildService,
  ) {}

  ///View Guild of a User
  @Get('')
  async view_guilds(@Request() req: Req) {
    const { userId } = req.userData;
    return await this.guildService.get_guild_by_userId(userId);
  }
}
