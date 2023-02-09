import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IGuild } from 'src/api/guild/model/guild.model';
import { TYPES } from 'src/core/types';

@Injectable()
export class GuildRepository {
  constructor(
    @Inject(TYPES.GuildModel) private readonly Guild: Model<IGuild>,
  ) {}

  ///Create
  async create(payload: any) {
    const guild = new this.Guild(payload);
    return await guild.save();
  }

  ///Get
  async getByUserId(userId: string) {
    const guilds = await this.Guild.find({ ownerId: userId });
    return guilds;
  }

  //Custom
  ///Get Guild under a user and map permission
  async getUserGuild(discord_id: string) {
    const guilds = await this.Guild.aggregate([
      {
        $match: {
          $or: [{ ownerId: discord_id }, { admins: discord_id }],
        },
      },
      {
        $addFields: {
          userRole: {
            $cond: [
              { $eq: ['$ownerId', discord_id] },
              'owner',
              {
                $cond: [{ $in: [discord_id, '$admins'] }, 'admin', 'user'],
              },
            ],
          },
        },
      },
    ]);

    return guilds;
  }
}
