import { Response } from 'express';
import { Req } from 'src/core/custom_types';
import { HttpException, Inject, NestMiddleware } from '@nestjs/common';
import { UserRepository } from 'src/api/users/repository/users.repository';
import { KittyGuildRepository } from 'src/api/kitty_chan/repository/kitty_guild.repository';
import { GUILD_USERS } from 'src/core/constants';

export class GuildAccess implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private userRepo: UserRepository,
    @Inject(KittyGuildRepository) private kittyGuildRepo: KittyGuildRepository,
  ) {}

  async use(req: Req, res: Response, next: (error?: any) => void) {
    const { userId } = req.userData;
    const guildId = req.params.guildId || req.body.guildId;
    if (!userId) throw new HttpException('Malformed auth token. Re-login', 401);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new HttpException('User not found', 400);

    const guild = await this.kittyGuildRepo.getSingleUserGuild(
      guildId,
      user.discord?.id,
    );
    if (
      !guild ||
      ![GUILD_USERS.guild_owner, GUILD_USERS.guild_admin].includes(
        guild.userRole,
      )
    ) {
      throw new HttpException('Forbidden Guild Access', 403);
    }

    req.userData.discord_id = guild.discord_id;
    req.userData.guildPermission = guild;
    next();
  }
}
