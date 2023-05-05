import { Injectable } from '@nestjs/common';
import { client } from 'src/main';

@Injectable()
export class KittyDiscordService {
  /**Guild */
  async getGuildById(guildId: string) {
    return client.guild.fetch(guildId);
  }
}
