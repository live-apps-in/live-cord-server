import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: String,
  guilds: Array<string>,
  discord: Object,
});

export interface IUser {
  _id: string;
  name: string;
  email: string;
  guilds: string[];
  discord: any;
}
