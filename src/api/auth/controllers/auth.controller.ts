import { Controller, Get, Post, Inject, Request, Query } from '@nestjs/common';
import { AuthService } from 'src/api/auth/service/auth.service';
import { Req } from 'src/core/custom_types';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  ///Connect with Discord
  @Get('/discord')
  async connectWithDiscord(@Query('code') code: string, @Request() req: Req) {
    const { userId } = req.userData;
    return this.authService.connectToDiscord(code, userId);
  }

  ///Send OTP for Discord Profile Validation
  @Get('/discord/send_otp')
  async send_otp_discord(@Request() req: Req) {
    const { userId } = req.userData;
    return await this.authService.send_otp_discord(userId);
  }

  ///Validate OTP for Discord Profile Validation
  @Post('discord/otp/validate')
  async validate_otp_discord(@Request() req: Req) {
    const { userId } = req.userData;
    const { otp } = req.body;

    return await this.authService.validate_otp_discord(userId, otp);
  }
}
