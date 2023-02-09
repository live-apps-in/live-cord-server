import { Inject, Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { GUILD_ACTIONS } from 'src/api/guild/enum/guild_actions';
import { IGuild } from 'src/api/guild/model/guild.model';
import { GuildRepository } from 'src/api/guild/repository/guild.repository';
import { EditGuildAdminDto } from 'src/api/guild/_dto/GuildAdmin.dto';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { UserService } from 'src/api/users/service/users.service';
import { GUILD_USERS } from 'src/core/constants';
import { TYPES } from 'src/core/types';

@Injectable()
export class GuildService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(GuildRepository) private readonly guildRepo: GuildRepository,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(TYPES.GuildModel) private readonly Guild: Model<IGuild>,
  ) {}

  //**Admin**//
  async edit_guild_admin(editAdminDto: EditGuildAdminDto) {
    const { ownerId, guildId, adminId, action } = editAdminDto;
    ///Check Owner guild permission
    const checkPermission = await this.fetchPermission(ownerId, guildId);
    if (!checkPermission.hasPermission)
      throw new HttpException('Forbidden Guild Access', 403);

    const guild = await this.guildRepo.getByGuildId(guildId);
    if (!guild) throw new HttpException('Guild not found', 400);

    if (action === GUILD_ACTIONS.ADD_ADMIN && guild.admins.includes(adminId)) {
      throw new HttpException('Admin already exists', 409);
    }

    ///Build query based on actions
    let updateQuery: any = {};
    if (action === GUILD_ACTIONS.ADD_ADMIN)
      updateQuery = {
        $push: { admins: adminId },
      };
    if (action === GUILD_ACTIONS.REMOVE_ADMIN)
      updateQuery = {
        $pull: { admins: adminId },
      };

    await this.guildRepo.update(guildId, updateQuery);

    return {
      guildId,
      ownerId,
      adminId,
    };
  }

  ///Find Guilds under a user and map permissions
  async get_guild_by_userId(userId: Types.ObjectId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);

    const discord_id = user.discord.id;
    if (!discord_id)
      throw new HttpException('Discord Profile not verified yet!', 400);

    return await this.guildRepo.getUserGuild(discord_id);
  }

  ///Extract Discord and guild Permission
  async fetchPermission(userId: Types.ObjectId, guildId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('user not found', 400);

    const userPermission: any = {
      hasPermission: true,
      discord_id: null,
      guildId,
      user_type: null,
    };

    ///If Discord Profile not verified
    if (!user.discord?.id && !user.discord.isVerified) {
      userPermission.hasPermission = false;
      userPermission.error = {
        message: 'Discord Profile not verified',
      };
      return userPermission;
    }

    const guild = await this.guildRepo.getSingleUserGuild(
      guildId,
      user.discord.id,
    );
    const userGuildRole = guild?.userRole;

    if (!userGuildRole || userGuildRole === 'user') {
      userPermission.hasPermission = false;
      userPermission.error = {
        message: 'Forbidden Guild Access',
      };
      return userPermission;
    }

    userPermission.user_type = userGuildRole;
    userPermission.discord_id = user.discord.id;
    return userPermission;
  }
}
