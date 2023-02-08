import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IAuth } from 'src/api/auth/model/auth.model';
import { IGuild } from 'src/api/guild/model/guild.model';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { UserRepository } from 'src/api/users/repository/users.repository';
import {
  CreateUserDto,
  InternalCreateUserDto,
} from 'src/api/users/_dto/CreateUserDto';
import { TYPES } from 'src/core/types';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(KittychanService)
    private readonly kittychanService: KittychanService,
    @Inject(TYPES.AuthModel) private readonly Auth: Model<IAuth>,
    @Inject(TYPES.GuildModel) private readonly Guild: Model<IGuild>,
  ) {}

  ///Create LiveCord User
  async create(payload: CreateUserDto) {
    ///Check User Duplication
    const getUser = await this.userRepo.findByEmail(payload.email);
    if (getUser) throw new HttpException('User Already Exists', 400);

    ///Fetch Discord profile
    const discordProfile = await this.kittychanService.profile(
      payload.discord_username,
    );

    const build_discord_profile: any = {
      username: payload.discord_username,
      isVerified: false,
    };

    if (discordProfile?.isValid && discordProfile?.id) {
      build_discord_profile.id = discordProfile.id;
    }

    const userSavePayload = new InternalCreateUserDto(
      payload.name,
      payload.email,
      build_discord_profile,
    );

    const createUser = await this.userRepo.create(userSavePayload);
    await this.Auth.insertMany({ userId: createUser._id });
    return createUser;
  }

  ////Fetch LiveCord Profile
  async profile(userId: Types.ObjectId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);
    return user;
  }
}
