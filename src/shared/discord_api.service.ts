import { Inject, Injectable } from '@nestjs/common';
import { DISCORD_API_CONFIG } from 'src/config/discord_api.config';
import { BOTS } from 'src/core/constants';
import { AxiosConfig, AxiosService } from 'src/shared/axios.service';

//** *
// Service for all kitty chan Discord API calls
//** */

@Injectable()
export class DiscordAPIService {
  constructor(
    @Inject(AxiosService) private readonly axiosService: AxiosService,
  ) {}

  async getGuild(guildId: string) {
    const { baseURL, actions, header } = DISCORD_API_CONFIG;
    const res = await this.axiosService.axiosInstance({
      url: baseURL,
      method: actions.getGuild.method,
      route: actions.getGuild.route(guildId),
      headers: header.Authorization(BOTS.kitty_chan),
    } as AxiosConfig);

    return res;
  }

  async fetchUserProfile(accessToken: string) {
    const { baseURL, actions } = DISCORD_API_CONFIG;
    const { fetchUserProfile } = actions;
    const res = await this.axiosService.axiosInstance({
      url: baseURL,
      method: fetchUserProfile.method,
      route: fetchUserProfile.route,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    } as AxiosConfig);

    return res;
  }
}
