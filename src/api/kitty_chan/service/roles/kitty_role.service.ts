import { Inject, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { DiscordAPIService } from 'src/shared/discord_api.service';
import {
  CreateKittyReactionRolesDto,
  KittyRolesDto,
} from 'src/api/kitty_chan/_dto/KittyRoles.dto';
import { KittyReactionRolesRepo } from 'src/api/kitty_chan/repository/roles/kitty_reaction_roles.repo';

@Injectable()
export class KittyRolesService {
  constructor(
    @Inject(DiscordAPIService)
    private readonly kittyDiscordService: DiscordAPIService,
    @Inject(KittyReactionRolesRepo)
    private readonly kittyReactionRolesRepo: KittyReactionRolesRepo,
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
}
