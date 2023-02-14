import { Inject, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { DiscordAPIService } from 'src/shared/discord_api.service';
import {
  CreateKittyReactionRolesDto,
  KittyReactionRolesActionDto,
  KittyRolesDto,
} from 'src/api/kitty_chan/_dto/KittyRoles.dto';
import { KittyReactionRolesRepo } from 'src/api/kitty_chan/repository/roles/kitty_reaction_roles.repo';
import { Types } from 'mongoose';
import {
  AxiosConfig,
  AxiosService,
  InternalAuthPayload,
} from 'src/shared/axios.service';
import { BOTS } from 'src/core/constants';
import apiConfig from 'src/config/api.config';
import { KittyGuildRepository } from 'src/api/kitty_chan/repository/kitty_guild.repository';

@Injectable()
export class KittyRolesService {
  constructor(
    @Inject(DiscordAPIService)
    private readonly kittyDiscordService: DiscordAPIService,
    @Inject(KittyReactionRolesRepo)
    private readonly kittyReactionRolesRepo: KittyReactionRolesRepo,
    @Inject(KittyGuildRepository)
    private readonly kittyGuildRepository: KittyGuildRepository,
    @Inject(AxiosService)
    private readonly axiosService: AxiosService,
  ) {}

  ///Roles
  async getAllRoles(guildId: string) {
    const getGuild = await this.kittyDiscordService.getGuild(guildId);
    if (!getGuild?.roles) throw new HttpException('Guild Not Found!', 400);

    const roles = [];
    getGuild.roles.map((e) => {
      roles.push(new KittyRolesDto(e.id, e.name, e.description, e.permissions));
    });

    return roles;
  }

  /**
   * Reaction Roles
   */
  ///Set Reaction Role Channel
  async setReactionRoleChannel(channelId: string, guildId: string) {
    await this.kittyGuildRepository.update(guildId, {
      $set: { 'config.reaction_roles_channel': channelId },
    });

    return {
      message: 'Reaction Role Channel Updated',
    };
  }

  async createReactionRoles(payload: CreateKittyReactionRolesDto) {
    const reaction_roles = await this.kittyReactionRolesRepo.getByName(
      payload.name,
      payload.guildId,
    );
    if (reaction_roles) throw new HttpException('Name already exists', 409);

    return await this.kittyReactionRolesRepo.create(payload);
  }

  async getReactionRoles(guildId: string) {
    const reaction_roles = await this.kittyReactionRolesRepo.getByGuildId(
      guildId,
    );
    return reaction_roles;
  }

  ///Reaction Roles Action
  async reactionRolesAction(reaction_role_id: Types.ObjectId, action: string) {
    const reaction_role = await this.kittyReactionRolesRepo.getById(
      reaction_role_id,
    );
    if (!reaction_role) throw new HttpException('Reaction Role not found', 400);

    const { guildId, reaction_role_message_ref, discordEmbedConfig } =
      reaction_role;

    const guild = await this.kittyGuildRepository.getByGuildId(guildId);
    if (!guild?.config?.reaction_roles_channel)
      throw new HttpException('Reaction Role channel not set', 400);

    const reactionRoleActionDto = {
      channelId: guild.config.reaction_roles_channel,
      action,
      reaction_role_message_ref,
      discordEmbedConfig,
    } as KittyReactionRolesActionDto;

    //Call kitty chan API
    const { baseURL, actions, header } = apiConfig.kitty_chan;
    const axiosConfig = {
      url: baseURL,
      method: actions.reaction_roles_action.method,
      route: actions.reaction_roles_action.route(action),
      body: { ...reactionRoleActionDto },
      headers: header(
        await this.axiosService.createAccessToken({
          scope: BOTS.kitty_chan,
          guildId,
        } as InternalAuthPayload),
      ),
    } as AxiosConfig;

    const reactionRoleAction = await this.axiosService.axiosInstance(
      axiosConfig,
    );

    if (!reactionRoleAction?.reaction_role_message_ref)
      throw new HttpException('Unable to set Reaction Role', 400);

    await this.kittyReactionRolesRepo.updateById(reaction_role_id, {
      $set: {
        isActive: true,
        reaction_role_message_ref: reactionRoleAction.reaction_role_message_ref,
      },
    });

    return {
      message: 'Reaction role is now set',
    };
  }
}
