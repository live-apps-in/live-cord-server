import { Module } from '@nestjs/common';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { AxiosService } from 'src/shared/axios.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KittychanService, AxiosService],
  exports: [KittychanService],
})
export class KittychanModule {}
