import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: String,
  kitty_chan: Object,
});

export interface IUser {
  name: string;
  email: string;
  kitty_chan: any;
}
