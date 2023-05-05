import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IAuth } from 'src/modules/auth/model/auth.model';
import { IKittyGuild } from 'src/modules/kitty_chan/model/kitty_guild.model';
import { KittychanService } from 'src/modules/kitty_chan/service/kitty_chan.service';
import { UserRepository } from 'src/modules/users/repository/users.repository';
import {
  CreateUserDto,
  InternalCreateUserDto,
} from 'src/modules/users/_dto/CreateUserDto';
import { TYPES } from 'src/core/types';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(KittychanService)
    private readonly kittychanService: KittychanService,
    @Inject(TYPES.AuthModel) private readonly Auth: Model<IAuth>,
    @Inject(TYPES.GuildModel) private readonly Guild: Model<IKittyGuild>,
  ) {}

  ///Create LiveCord User
  async create(payload: CreateUserDto) {
    ///Check User Duplication
    const getUser = await this.userRepo.findByEmail(payload.email);
    if (getUser) throw new HttpException('User Already Exists', 400);

    const userSavePayload = new InternalCreateUserDto(
      payload.name,
      payload.email,
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
