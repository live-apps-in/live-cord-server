import { Inject, Injectable, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';
import { GuildRepository } from 'src/api/guild/repository/guild.repository';
import { UserRepository } from 'src/api/users/repository/users.repository';

@Injectable()
export class GuildService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(GuildRepository) private readonly guildRepo: GuildRepository,
  ) {}

  ///Map and find guild with Owner privilege
  async get_guild_by_userId(userId: Types.ObjectId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);

    const discord_id = user.discord.id;
    if (!discord_id)
      throw new HttpException('Discord Profile not verified yet!', 400);

    return await this.guildRepo.getByUserId(discord_id);
  }
}
