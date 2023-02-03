import { Controller, Get, Inject, Request } from '@nestjs/common';
import { AuthService } from 'src/api/auth/service/auth.service';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { Req } from 'src/core/custom_types';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Get('/discord/send_otp')
  async auth(@Request() req: Req) {
    const { userId } = req.userData;
    return await this.authService.send_otp(userId);
  }
}
