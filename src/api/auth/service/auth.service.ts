import { HttpException, Inject, Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { Model, Types } from 'mongoose';
import { AUTH_CONTENT } from 'src/api/auth/content/auth.content';
import { IAuth } from 'src/api/auth/model/auth.model';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { TYPES } from 'src/core/types';
import { random_numbers } from 'src/utils/numbers/number';
import * as jwt from 'jsonwebtoken';
import * as DiscordOAuth2 from 'discord-oauth2';
import 'dotenv/config';
import { DiscordAPIService } from 'src/shared/discord_api.service';
@Injectable()
export class AuthService {
  private JWT_SECRET = process.env.JWT_SECRET;
  private DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  private DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  private DISCORD_REDIRECT_URL = process.env.DISCORD_REDIRECT_URL;

  private oauth = new DiscordOAuth2({
    clientId: this.DISCORD_CLIENT_ID,
    clientSecret: this.DISCORD_CLIENT_SECRET,
  });

  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(DiscordAPIService)
    private readonly discordAPIService: DiscordAPIService,
    @Inject(KittychanService)
    private readonly kittychanService: KittychanService,
    @Inject(TYPES.AuthModel) private readonly Auth: Model<IAuth>,
  ) {}

  ///Connect to Discord
  async connectToDiscord(code: string, userId) {
    const token = await this.oauth
      .tokenRequest({
        code,
        scope: ['identify'],
        grantType: 'authorization_code',
        redirectUri: this.DISCORD_REDIRECT_URL,
      })
      .catch(() => {
        throw new HttpException('Invalid Auth Code', 400);
      });

    if (!token) throw new HttpException('Invalid Auth Code', 400);

    const user = await this.discordAPIService.fetchUserProfile(
      token.access_token,
    );
    if (!user) throw new HttpException('Cannot connect to discord', 400);

    await this.userRepo.update(userId, {
      discord: user,
    });

    return {
      message: 'ok',
    };
  }

  ////Send OTP via Discord Bot (kitty chan - Profile Validation)
  async send_otp_discord(_id: Types.ObjectId) {
    const user = await this.userRepo.findById(_id);
    if (!user) throw new HttpException('User not found', 400);

    const discord_id = user.discord?.id;
    if (!discord_id)
      throw new HttpException('No valid Discord Username found', 400);

    ///Generate OTP
    const otp = random_numbers(6).toString();
    const otpHash = hashSync(otp, 12);
    const signature = jwt.sign({}, this.JWT_SECRET, { expiresIn: '30s' });

    ///Update Auth _2FA
    await this.Auth.updateOne(
      { userId: _id },
      {
        $set: {
          _2fa: {
            otp: otpHash,
            signature,
          },
        },
      },
    );

    const triggerKittyChan = await this.kittychanService.send_message(
      discord_id,
      AUTH_CONTENT.send_otp(otp),
    );

    if (!triggerKittyChan) throw new HttpException('Unable to send OTP', 400);

    return {
      message: 'OTP Sent',
    };
  }

  ///Validate OTP for Discord Profile Verification
  async validate_otp_discord(userId: Types.ObjectId, otp: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);

    const auth = await this.Auth.findOne({ userId });
    const { _2fa } = auth;
    if (!auth?._2fa?.otp) throw new HttpException('OTP Expired', 400);

    try {
      jwt.verify(_2fa.signature, this.JWT_SECRET);
    } catch (e) {
      throw new HttpException('OTP Expired', 400);
    }

    if (!compareSync(otp, _2fa.otp))
      throw new HttpException('Invalid OTP', 400);

    await this.Auth.updateOne(
      { userId },
      {
        $set: {
          _2fa: {
            otp: null,
            signature: null,
          },
        },
      },
    );

    await this.userRepo.update(userId, {
      'discord.isVerified': true,
    });

    return {
      status: 'accepted',
    };
  }
}
