import { Module } from '@nestjs/common';
import { guildProvider } from 'src/api/guild/model/guild.provider';
import { GuildRepository } from 'src/api/guild/repository/guild.repository';
import { GuildService } from 'src/api/guild/service/guild.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GuildService, GuildRepository, ...guildProvider],
  exports: [GuildService],
})
export class GuildModule {}
