import { GrpcMethod } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import {
  GuildMemberReq,
  GuildMemberRes,
} from 'src/proto/interface/live_cord.interface';
import { KittyGuildService } from 'src/modules/kitty_chan/service/kitty_guild.service';

@Controller()
export class KittyGuildGrpcController {
  constructor(
    @Inject(KittyGuildService) private readonly guildService: KittyGuildService,
  ) {}

  @GrpcMethod('GuildService', 'syncCreateGuildMember')
  async syncCreateGuildMember(data: GuildMemberReq): Promise<GuildMemberRes> {
    const { guildId, userId } = data;

    await this.guildService.syncCreateGuildMember(guildId, userId);
    return {
      message: 'Member sync successful',
    };
  }

  @GrpcMethod('GuildService', 'syncRemoveGuildMember')
  async syncRemoveGuildMember(data: GuildMemberReq): Promise<GuildMemberRes> {
    const { guildId, userId } = data;

    await this.guildService.syncRemoveGuildMember(guildId, userId);
    return {
      message: 'Member sync successful',
    };
  }
}
