import { BOTS } from 'src/core/constants';

export const DISCORD_API_CONFIG = {
  baseURL: 'https://discord.com/api/v9',

  actions: {
    ///Fetch Guild
    getGuild: {
      method: 'GET',
      route: (guildId) => {
        return `/guilds/${guildId}`;
      },
    },

    ///User Profile @me
    fetchUserProfile: {
      method: 'GET',
      route: '/users/@me',
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
