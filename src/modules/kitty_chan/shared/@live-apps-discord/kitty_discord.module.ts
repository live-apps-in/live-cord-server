import { Module } from '@nestjs/common';
import { KittyDiscordService } from 'src/modules/kitty_chan/shared/@live-apps-discord/service/kitty_discord.service';

@Module({
  providers: [KittyDiscordService],
  exports: [KittyDiscordService],
})
export class KittyDiscordModule {}
