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

      // //**
      // GUILD
      // All Guild based Operation
      // **//
      //Profile
      guild_profile: {
        route: '/live_cord/guild/profile',
        method: 'POST',
      },

      //Feature
      edit_guild_feature: {
        route: '/live_cord/guild/features',
        method: 'PATCH',
      },

      //Roles
      view_guild_roles: {
        route: '/live_cord/guild/roles',
        method: 'GET',
      },
      reaction_roles_action: {
        route: (action: string) => {
          return `/live_cord/guild/reaction_roles/${action}`;
        },
        method: 'PATCH',
      },
    },

    ///Jwt
    header: (jwt: string) => {
      return {
        'x-internal-token': jwt,
      };
    },
  },
};
