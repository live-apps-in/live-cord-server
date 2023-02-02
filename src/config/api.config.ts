export default {
  ///Kitty Chan Events App
  kitty_chan: {
    // baseURL: 'https://kittychan.jagalive.in',
    baseURL: 'http://127.0.0.1:5000',
    actions: {
      profile: {
        route: '/live_cord/user/profile',
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
