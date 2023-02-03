import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from 'src/api/users/repository/users.repository';
import {
  CreateUserDto,
  InternalCreateUserDto,
} from 'src/api/users/_dto/CreateUserDto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async create(payload: CreateUserDto) {
    ///Check User Duplication
    const getUser = await this.userRepo.findByEmail(payload.email);
    if (getUser) throw new HttpException('User Already Exists', 400);

    const userSavePayload = new InternalCreateUserDto(
      payload.name,
      payload.email,
      { username: payload.discord_username, isVerified: false },
    );

    return await this.userRepo.create(userSavePayload);
  }

  async profile(userId: Types.ObjectId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);
    return user;
  }
}
