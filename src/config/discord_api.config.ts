import { BOTS } from 'src/core/constants';

export const DISCORD_API_CONFIG = {
  baseURL: 'https://discord.com/api/v9',

  ///Fetch Guild
  actions: {
    getGuild: {
      method: 'GET',
      route: (guildId) => {
        return `/guilds/${guildId}`;
      },
    },
  },

  header: {
    Authorization: (scope: string) => {
      let bot_token: string;
      scope === BOTS.kitty_chan
        ? (bot_token = process.env.KITTY_CHAN_TOKEN)
        : '';

      return {
        Authorization: `Bot ${bot_token}`,
      };
    },
  },
};
