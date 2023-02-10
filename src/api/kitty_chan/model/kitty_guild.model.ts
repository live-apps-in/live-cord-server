import { Schema } from 'mongoose';

export const KittyGuildSchema = new Schema({
  name: String,
  guildId: String,
  ownerId: String,
  admins: [String],
});

export interface IKittyGuild {
  name: string;
  guildId: string;
  ownerId: string;
  admins: string[];
}
