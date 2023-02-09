import { HttpException } from '@nestjs/common';
import { Types } from 'mongoose';
import { GUILD_ACTIONS } from 'src/api/guild/enum/guild_actions';

export class EditGuildAdminDto {
  constructor(
    public guildId: string,
    public ownerId: Types.ObjectId,
    public adminId: string,
    public action: GUILD_ACTIONS,
  ) {}

  validateAction() {
    const action = this.action;
    if (!Object.values(GUILD_ACTIONS).includes(action))
      throw new HttpException('Invalid Action', 400);
  }
}
