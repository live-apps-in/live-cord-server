import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IGuild } from 'src/api/guild/model/guild.model';
import { TYPES } from 'src/core/types';

@Injectable()
export class GuildRepository {
  constructor(
    @Inject(TYPES.GuildModel) private readonly Guild: Model<IGuild>,
  ) {}

  async create(payload: any) {
    const guild = new this.Guild(payload);
    return await guild.save();
  }
}
