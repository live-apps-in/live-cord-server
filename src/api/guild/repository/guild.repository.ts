import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IGuild } from 'src/api/guild/model/guild.model';
import { GUILD_USERS } from 'src/core/constants';
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
  async getByGuildId(guildId: string) {
    const guild = await this.Guild.findOne({ guildId });
    return guild;
  }

  async getByUserId(userId: string) {
    const guilds = await this.Guild.find({ ownerId: userId });
    return guilds;
  }

  ///Update
  async update(guildId: string, payload: any) {
    await this.Guild.updateOne(
      { guildId },
      {
        ...payload,
      },
    );
  }

  //Custom
  ///Get Guild with userId and guildId
  async getSingleUserGuild(guildId: string, discord_id: string) {
    const guilds = await this.Guild.aggregate([
      {
        $match: {
          guildId,
          $or: [{ ownerId: discord_id }, { admins: discord_id }],
        },
      },
      {
        $addFields: {
          userRole: {
            $cond: [
              { $eq: ['$ownerId', discord_id] },
              GUILD_USERS.guild_owner,
              {
                $cond: [
                  { $in: [discord_id, '$admins'] },
                  GUILD_USERS.guild_admin,
                  GUILD_USERS.guild_user,
                ],
              },
            ],
          },
        },
      },
    ]);

    return guilds[0];
  }

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
              GUILD_USERS.guild_owner,
              {
                $cond: [
                  { $in: [discord_id, '$admins'] },
                  GUILD_USERS.guild_admin,
                  GUILD_USERS.guild_user,
                ],
              },
            ],
          },
        },
      },
    ]);

    return guilds;
  }
}
