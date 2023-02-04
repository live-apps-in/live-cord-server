import { Connection } from 'mongoose';
import { AuthSchema } from 'src/api/auth/model/auth.model';
import { TYPES } from 'src/core/types';

export const authProviders = [
  {
    provide: TYPES.AuthModel,
    useFactory: (connection: Connection) =>
      connection.model('auth', AuthSchema),
    inject: [TYPES.DatabaseConnection],
  },
];
