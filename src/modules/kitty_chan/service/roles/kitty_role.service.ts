import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { CreateKittyReactionRolesDto } from 'src/modules/kitty_chan/_dto/KittyRoles.dto';
import { KittyReactionRolesRepo } from 'src/modules/kitty_chan/repository/roles/kitty_reaction_roles.repo';
import { Types } from 'mongoose';
import { KittyGuildRepository } from 'src/modules/kitty_chan/repository/kitty_guild.repository';
import { ClientGrpc } from '@nestjs/microservices';
import { ReactionRoleService } from 'src/proto/interface/kitty_chan.interface';

@Injectable()
export class KittyRolesService implements OnModuleInit {
  private grpcReactionRolesService: ReactionRoleService;
  constructor(
    @Inject(KittyReactionRolesRepo)
    private readonly kittyReactionRolesRepo: KittyReactionRolesRepo,
    @Inject(KittyGuildRepository)
    private readonly kittyGuildRepository: KittyGuildRepository,
    @Inject('kitty_chan_grpc') private readonly kittyChanGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcReactionRolesService =
      this.kittyChanGrpc.getService<ReactionRoleService>('ReactionRoleService');
  }

  /* Reaction Roles */
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
  async reactionRolesAction(
    guildId: string,
    reaction_role_id: Types.ObjectId,
    action: string,
  ) {
    const reaction_role = await this.kittyReactionRolesRepo.getById(
      reaction_role_id,
    );
    if (!reaction_role) throw new HttpException('Reaction Role not found', 400);

    const reactionRoleAction: any = await this.grpcReactionRolesService
      .reactionRolesAction({
        name: reaction_role.name,
        action,
        channelId: reaction_role.channelId,
        guildId: reaction_role.guildId,
        discordEmbedConfig: reaction_role.discordEmbedConfig,
        rolesMapping: reaction_role.rolesMapping,
        reactionRoleMessageRef: reaction_role.reactionRoleMessageRef,
      })
      .toPromise();

    if (!reactionRoleAction?.reactionRoleMessageRef)
      throw new HttpException('Unable to set Reaction Role', 400);

    await this.kittyReactionRolesRepo.updateById(reaction_role_id, {
      $set: {
        isActive: true,
        reactionRoleMessageRef: reactionRoleAction.reactionRoleMessageRef,
      },
    });

    return reactionRoleAction;
  }
}
