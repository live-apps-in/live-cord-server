import { Inject, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Types } from 'mongoose';
import { GUILD_ACTIONS } from 'src/modules/kitty_chan/enum/kitty_guild_actions';
import { KittyGuildRepository } from 'src/modules/kitty_chan/repository/kitty_guild.repository';
import { EditKittyGuildAdminDto } from 'src/modules/kitty_chan/_dto/KittyGuildAdmin.dto';
import { UserRepository } from 'src/modules/users/repository/users.repository';
import { BOTS } from 'src/core/constants';
import { AxiosService } from 'src/shared/axios.service';
import { KittyDiscordService } from 'src/modules/kitty_chan/shared/@live-apps-discord/service/kitty_discord.service';

@Injectable()
export class KittyGuildService {
  constructor(
    @Inject(AxiosService) private readonly axiosService: AxiosService,
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(KittyGuildRepository)
    private readonly guildRepo: KittyGuildRepository,
    @Inject(KittyDiscordService)
    private readonly kittyDiscordService: KittyDiscordService,
  ) {}

  ///Guild
  async getProfile(userId: Types.ObjectId, guildId: string) {
    ///Validate Permission
    const fetchPermission = await this.fetchPermission(userId, guildId);

    if (!fetchPermission.hasPermission) {
      throw new HttpException({ error: fetchPermission.error }, 400);
    }

    return this.kittyDiscordService.getGuildById(guildId);
  }
  ///Guild
  async getChannels(userId: Types.ObjectId, guildId: string) {
    ///Validate Permission
    const fetchPermission = await this.fetchPermission(userId, guildId);

    if (!fetchPermission.hasPermission) {
      throw new HttpException({ error: fetchPermission.error }, 400);
    }

    return this.kittyDiscordService.getGuildChannels(guildId);
  }

  ///Find Guilds under a user and map permissions
  async get_guild_by_userId(userId: Types.ObjectId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);

    const discord_id = user.discord.id;
    if (!discord_id)
      throw new HttpException('Discord Profile not verified yet!', 400);

    return this.guildRepo.getAdminGuildByUser(discord_id);
  }

  ///Find All Guilds of a User
  async getAllUserGuilds(userId: Types.ObjectId) {
    return await this.guildRepo.getAllUserGuild(userId);
  }

  ///Sync new Guild members
  async syncCreateGuildMember(guildId: string, userId: string) {
    await this.userRepo.updateByDiscordId(userId, {
      $addToSet: {
        guilds: guildId,
      },
    });
  }

  ///Sync new Guild members
  async syncRemoveGuildMember(guildId: string, userId: string) {
    await this.userRepo.updateByDiscordId(userId, {
      $pull: {
        guilds: guildId,
      },
    });
  }

  ////**Features**////
  async edit_guild_feature(
    userId: Types.ObjectId,
    guildId: string,
    features: any,
  ) {
    ///Validate Permission
    const fetchPermission = await this.fetchPermission(userId, guildId);

    if (!fetchPermission.hasPermission)
      throw new HttpException({ error: fetchPermission.error }, 400);

    const editFeature = await this.axiosService.handle({
      scope: BOTS.kitty_chan,
      action: 'edit_guild_feature',
      body: {
        guildId,
        discord_id: fetchPermission.discord_id,
        features,
      },
    });

    return await editFeature;
  }

  //**Admin**//
  async edit_guild_admin(editAdminDto: EditKittyGuildAdminDto) {
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
      message: 'Update Success',
    };
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
    if (!user.discord?.id) {
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
