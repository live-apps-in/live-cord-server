import { Inject, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Types } from 'mongoose';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserService } from 'src/api/users/service/users.service';
import { BOTS } from 'src/core/constants';
import { AxiosService } from 'src/shared/axios.service';

@Injectable()
export class KittyGuildService {
  constructor(
    @Inject(AxiosService) private readonly axiosService: AxiosService,
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  ////**Features**////
  ///Get Guild Profile
  async getProfile(userId: Types.ObjectId, guildId: string) {
    ///Validate Permission
    const fetchPermission = await this.userService.fetchPermission(
      userId,
      guildId,
    );
    if (!fetchPermission.hasPermission)
      throw new HttpException({ error: fetchPermission.error }, 400);

    const getFeature = await this.axiosService.handle({
      scope: BOTS.kitty_chan,
      action: 'guild_profile',
      body: {
        guildId,
        discord_id: fetchPermission.discord_id,
      },
    });

    return getFeature;
  }
}
