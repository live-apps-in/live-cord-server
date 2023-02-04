import { Connection } from 'mongoose';
import { GuildSchema } from 'src/api/guild/model/guild.model';
import { TYPES } from 'src/core/types';

export const guildProvider = [
  {
    provide: TYPES.GuildModel,
    useFactory: (connection: Connection) =>
      connection.model('guild', GuildSchema),
    inject: [TYPES.DatabaseConnection],
  },
];
