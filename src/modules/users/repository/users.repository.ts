import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IUser } from 'src/modules/users/model/users.model';
import { InternalCreateUserDto } from 'src/modules/users/_dto/CreateUserDto';
import { TYPES } from 'src/core/types';

@Injectable()
export class UserRepository {
  constructor(@Inject(TYPES.UsersModel) private readonly user: Model<IUser>) {}

  async create(payload: InternalCreateUserDto): Promise<IUser> {
    const User = new this.user(payload);
    return await User.save();
  }

  async findById(_id: Types.ObjectId): Promise<IUser> {
    const user = await this.user.findOne({ _id });
    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.user.findOne({ email });
    return user;
  }

  async update(_id: Types.ObjectId, payload: any) {
    await this.user.updateOne(
      { _id },
      {
        $set: { ...payload },
      },
    );
  }

  async updateByDiscordId(discordId: string, payload: any) {
    await this.user.updateOne(
      { 'discord.id': discordId },
      {
        ...payload,
      },
    );
  }
}
