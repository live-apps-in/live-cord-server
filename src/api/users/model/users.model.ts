import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: String,
});

export interface IUser {
  name: string;
  email: string;
}
