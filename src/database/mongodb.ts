import * as mongoose from 'mongoose';
import 'dotenv/config';
import { TYPES } from 'src/core/types';
console.log(process.env.MONGO_URI)
export const databaseProviders = [
  {
    provide: TYPES.DatabaseConnection,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.MONGO_URI),
  },
];
