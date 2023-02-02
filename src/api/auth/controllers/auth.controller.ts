import { Controller, Get, Inject, Request } from '@nestjs/common';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { Req } from 'src/core/custom_types';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(KittychanService)
    private readonly kitty_chanService: KittychanService,
  ) {}

  @Get('/discord/send_otp')
  async auth(@Request() req: Req) {
    const { userId } = req.userData;
    return { userId };
  }
}
