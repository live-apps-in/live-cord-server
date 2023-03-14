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
import { GuildService } from 'src/proto/interface/kitty_chan.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { wait } from 'src/jobs/rate-limiter';
import { KittyGuildRepository } from 'src/api/kitty_chan/repository/kitty_guild.repository';
@Injectable()
export class AuthService implements OnModuleInit {
  private JWT_SECRET = process.env.JWT_SECRET;
  private DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  private DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  private DISCORD_REDIRECT_URL = process.env.DISCORD_REDIRECT_URL;
  private kittyGuildGrpcService: GuildService;

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
    @Inject(KittyGuildRepository)
    private readonly kittyGuildRepo: KittyGuildRepository,
    @Inject('kitty_chan_grpc') private readonly kittyChanGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.kittyGuildGrpcService =
      this.kittyChanGrpc.getService<GuildService>('GuildService');
  }

  ///Connect to Discord
  async connectToDiscord(code: string, userId: Types.ObjectId) {
    const token = await this.oauth
      .tokenRequest({
        code,
        scope: ['identify', 'guilds'],
        grantType: 'authorization_code',
        redirectUri: this.DISCORD_REDIRECT_URL,
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException('Invalid Auth Code', 400);
      });

    if (!token) throw new HttpException('Invalid Auth Code', 400);

    ///Fetch Discord user profile
    const discordUser = await this.discordAPIService.fetchUserProfile(
      token.access_token,
    );
    if (!discordUser) throw new HttpException('Cannot connect to discord', 400);

    ///Fetch All User Guilds
    await wait(1);
    const userGuilds = await this.discordAPIService.getUserGuilds(
      token.access_token,
    );
    if (!userGuilds) throw new HttpException('Cannot fetch user guilds', 500);

    ///Get all mutual guilds
    const mutualGuilds = await this.kittyGuildRepo.getMutualUserGuilds(
      userGuilds.map((item) => item.id),
    );

    ///Update Discord payload and mutual guilds
    await this.userRepo.update(userId, {
      discord: discordUser,
      guilds: mutualGuilds.map((item) => item.guildId),
    });

    return {
      message: 'Connected to Discord',
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
