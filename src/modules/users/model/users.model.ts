import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: String,
  guilds: Array<string>,
  discord: {
    type: Object,
    default: null,
  },
});

export interface IUser {
  _id: string;
  name: string;
  email: string;
  guilds: string[];
  discord: any;
}
