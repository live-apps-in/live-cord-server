import { Connection } from 'mongoose';
import { UserSchema } from 'src/api/users/model/users.model';
import { TYPES } from 'src/core/types';

export const usersProvider = [
  {
    provide: TYPES.UsersModel,
    useFactory: (connection: Connection) =>
      connection.model('users', UserSchema),
    inject: [TYPES.DatabaseConnection],
  },
];
