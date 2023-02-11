import { Inject, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { KittyDiscordService } from 'src/api/kitty_chan/service/discord/KittyDiscord.service';
import { KittyRolesDto } from 'src/api/kitty_chan/_dto/KittyRoles.dto';

@Injectable()
export class KittyRolesService {
  constructor(
    @Inject(KittyDiscordService)
    private readonly kittyDiscordService: KittyDiscordService,
  ) {}

  async getAllRoles(guildId: string) {
    const getGuild = await this.kittyDiscordService.getGuild(guildId);
    if (!getGuild?.roles) throw new HttpException('Guild Not Found!', 400);

    const roles = [];
    getGuild.roles.map((e) => {
      roles.push(new KittyRolesDto(e.id, e.name, e.description, e.permissions));
    });

    return roles;
  }
}
