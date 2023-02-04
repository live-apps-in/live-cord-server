import { Module } from '@nestjs/common';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { KittyGuildService } from 'src/api/kitty_chan/service/kitty_guild.service';
import { UserModule } from 'src/api/users/users.module';
import { AxiosService } from 'src/shared/axios.service';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [KittychanService, KittyGuildService, AxiosService],
  exports: [KittychanService, KittyGuildService],
})
export class KittychanModule {}
