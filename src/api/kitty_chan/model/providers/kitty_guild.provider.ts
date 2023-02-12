import { Connection } from 'mongoose';
import { KittyGuildSchema } from 'src/api/kitty_chan/model/kitty_guild.model';
import { TYPES } from 'src/core/types';

export const guildProvider = [
  {
    provide: TYPES.GuildModel,
    useFactory: (connection: Connection) =>
      connection.model('kitty_guild', KittyGuildSchema),
    inject: [TYPES.DatabaseConnection],
  },
];
