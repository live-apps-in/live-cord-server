import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IKittyReactionRoles } from 'src/api/kitty_chan/model/kitty_reaction_roles.model';
import { CreateKittyReactionRolesDto } from 'src/api/kitty_chan/_dto/KittyRoles.dto';
import { TYPES } from 'src/core/types';

@Injectable()
export class KittyReactionRolesRepo {
  constructor(
    @Inject(TYPES.ReactionRolesModel)
    private readonly kittyReactionRoles: Model<IKittyReactionRoles>,
  ) {}

  async create(payload: CreateKittyReactionRolesDto) {
    const reaction_roles = new this.kittyReactionRoles(payload);
    return await reaction_roles.save();
  }

  async getById(_id: Types.ObjectId) {
    const reactionRoles = await this.kittyReactionRoles.findOne({ _id });
    return reactionRoles;
  }
  async getByName(name: string, guildId: string) {
    const reactionRoles = await this.kittyReactionRoles.findOne({
      name,
      guildId,
    });
    return reactionRoles;
  }
  async getByGuildId(guildId: string) {
    const reactionRoles = await this.kittyReactionRoles.find({ guildId });
    return reactionRoles;
  }

  async updateById(_id: Types.ObjectId, payload: any) {
    return await this.kittyReactionRoles.updateOne({ _id }, { ...payload });
  }
}
