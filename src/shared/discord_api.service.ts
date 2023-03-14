import { Inject, Injectable } from '@nestjs/common';
import { DISCORD_API_CONFIG } from 'src/config/discord_api.config';
import { BOTS } from 'src/core/constants';
import { AxiosConfig, AxiosService } from 'src/shared/axios.service';
import { REST } from '@discordjs/rest';
//** *
// Service for all kitty chan Discord API calls
//** */

@Injectable()
export class DiscordAPIService {
  private rest = new REST({ version: '9' }).setToken(
    process.env.KITTY_CHAN_TOKEN,
  );
  constructor(
    @Inject(AxiosService) private readonly axiosService: AxiosService,
  ) {}

  /**Guild */
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

  async getUserGuilds(accessToken: string) {
    const { baseURL, actions } = DISCORD_API_CONFIG;
    const { getUserGuilds } = actions;

    const res = await this.axiosService.axiosInstance({
      url: baseURL,
      method: getUserGuilds.method,
      route: getUserGuilds.route,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    } as AxiosConfig);

    return res;
  }

  async getGuildEmojis(guildId: string) {
    const { baseURL, actions, header } = DISCORD_API_CONFIG;
    const res = await this.axiosService.axiosInstance({
      url: baseURL,
      method: actions.getGuild.method,
      route: actions.getGuildEmojis.route(guildId),
      headers: header.Authorization(BOTS.kitty_chan),
    } as AxiosConfig);

    return res;
  }

  async fetchUserProfile(accessToken: string) {
    const { baseURL, actions } = DISCORD_API_CONFIG;
    const { getUserProfile } = actions;
    const res = await this.axiosService.axiosInstance({
      url: baseURL,
      method: getUserProfile.method,
      route: getUserProfile.route,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    } as AxiosConfig);

    return res;
  }
}
