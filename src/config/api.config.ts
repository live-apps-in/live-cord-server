export default {
  kitty_chan: {
    // baseURL: 'https://kittychan.jagalive.in',
    baseURL: 'http://127.0.0.1:5001',
    actions: {
      //Discord Profile
      profile: {
        route: '/live_cord/user/profile',
        method: 'POST',
      },

      //Send Direct Message
      send_direct_message: {
        route: '/live_cord/user/send_message',
        method: 'POST',
      },

      //**Features**//
      view_guild_features: {
        route: '/live_cord/guild/features',
        method: 'POST',
      },
    },
    header: (jwt: string) => {
      return {
        'x-internal-token': jwt,
      };
    },
  },
};
