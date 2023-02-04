import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { KittychanService } from 'src/api/kitty_chan/service/kitty_chan.service';
import { UserRepository } from 'src/api/users/repository/users.repository';
import {
  CreateUserDto,
  InternalCreateUserDto,
} from 'src/api/users/_dto/CreateUserDto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(KittychanService)
    private readonly kittychanService: KittychanService,
  ) {}

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
    return createUser;
  }

  async profile(userId: Types.ObjectId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);
    return user;
  }
}
