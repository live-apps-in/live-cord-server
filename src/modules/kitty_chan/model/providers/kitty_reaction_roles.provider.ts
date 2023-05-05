import { Connection } from 'mongoose';
import { KittyReactionRolesSchema } from 'src/modules/kitty_chan/model/kitty_reaction_roles.model';
import { TYPES } from 'src/core/types';

export const kittyReactionRolesProvider = [
  {
    provide: TYPES.ReactionRolesModel,
    useFactory: (connection: Connection) =>
      connection.model('kitty_reaction_roles', KittyReactionRolesSchema),
    inject: [TYPES.DatabaseConnection],
  },
];
