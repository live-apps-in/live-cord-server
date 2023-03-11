import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { DiscordAPIService } from 'src/shared/discord_api.service';
import {
  CreateKittyReactionRolesDto,
  KittyRolesDto,
} from 'src/api/kitty_chan/_dto/KittyRoles.dto';
import { KittyReactionRolesRepo } from 'src/api/kitty_chan/repository/roles/kitty_reaction_roles.repo';
import { Types } from 'mongoose';
import { AxiosService } from 'src/shared/axios.service';
import { KittyGuildRepository } from 'src/api/kitty_chan/repository/kitty_guild.repository';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { microserviceOptions } from 'src/microservice/grpc_client_options';
import { ReactionRoleService } from 'src/proto/interface/kitty_chan.interface';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class KittyRolesService implements OnModuleInit {
  @Client(microserviceOptions)
  private client: ClientGrpc;
  private grpcRolesService: ReactionRoleService;

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

  onModuleInit() {
    this.grpcRolesService = this.client.getService<ReactionRoleService>(
      'ReactionRoleService',
    );
  }

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

  ///Create Reaction Role mapping in LiveCord
  async createReactionRoles(payload: CreateKittyReactionRolesDto) {
    const reaction_roles = await this.kittyReactionRolesRepo.getByName(
      payload.name,
      payload.guildId,
    );
    if (reaction_roles) throw new HttpException('Name already exists', 409);

    return await this.kittyReactionRolesRepo.create(payload);
  }

  ///Get all Reaction Roles from LiveCord
  async getReactionRoles(guildId: string) {
    const reaction_roles = await this.kittyReactionRolesRepo.getByGuildId(
      guildId,
    );
    return reaction_roles;
  }

  ///Reaction Roles Action (SET, UPDATE, DELETE)
  async reactionRolesAction(reaction_role_id: Types.ObjectId, action: string) {
    const reaction_role = await this.kittyReactionRolesRepo.getById(
      reaction_role_id,
    );
    if (!reaction_role) throw new HttpException('Reaction Role not found', 400);

    const { config } = await this.kittyGuildRepository.getByGuildId(
      reaction_role.guildId,
    );
    if (!config?.reaction_roles_channel)
      throw new HttpException('Reaction Role channel not set', 400);

    const getAuth: any = new grpc.Metadata().add('authorization', 'hello');

    const reactionRoleAction: any =
      await this.grpcRolesService.reactionRolesAction(
        {
          name: reaction_role.name,
          action,
          channelId: config.reaction_roles_channel,
          discordEmbedConfig: reaction_role.discordEmbedConfig,
          reactionRoleMessageRef: reaction_role.reactionRoleMessageRef,
        },
        getAuth,
      );

    const res = await reactionRoleAction.toPromise();
    console.log(res);

    if (!res?.reaction_role_message_ref)
      throw new HttpException('Unable to set Reaction Role', 400);

    await this.kittyReactionRolesRepo.updateById(reaction_role_id, {
      $set: {
        isActive: true,
        reaction_role_message_ref: res.reaction_role_message_ref,
      },
    });

    return res;
  }
}
