import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GuildService {
  constructor(
    @Inject(GuildService) private readonly guildService: GuildService,
  ) {}

  ///Map and find guild with Owner privilege
  async map(guild: any[]) {}
}
