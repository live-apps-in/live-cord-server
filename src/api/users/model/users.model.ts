import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: String,
  discord: Object,
});

export interface IUser {
  name: string;
  email: string;
  discord: any;
}
