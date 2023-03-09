import {
  Controller,
  Get,
  Post,
  Inject,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import passport from 'passport';
import { AuthService } from 'src/api/auth/service/auth.service';
import { DiscordStrategy } from 'src/api/auth/strategy/discord.strategy';
import { Req } from 'src/core/custom_types';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly discordStrategy: DiscordStrategy,
  ) {}

  ///Connect with Discord
  @Get('/discord')
  // @UseGuards(AuthGuard(''))
  async connectWithDiscord() {
    console.log('hello');
    return { message: 'test' };
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
