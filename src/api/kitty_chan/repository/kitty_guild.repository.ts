import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IKittyGuild } from 'src/api/kitty_chan/model/kitty_guild.model';
import { IUser } from 'src/api/users/model/users.model';
import { GUILD_USERS } from 'src/core/constants';
import { TYPES } from 'src/core/types';

@Injectable()
export class KittyGuildRepository {
  constructor(
    @Inject(TYPES.GuildModel) private readonly Guild: Model<IKittyGuild>,
    @Inject(TYPES.UsersModel) private readonly User: Model<IUser>,
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
  ///Get All User Guilds
  async getAllUserGuild(userId: Types.ObjectId) {
    return this.User.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId) },
      },
    ]);
  }

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

    if (guilds[0]) {
      guilds[0].discord_id = discord_id;
    }
    return guilds[0];
  }

  ///Get Guild under a user and map permission
  async getAdminGuildByUser(discord_id: string) {
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
