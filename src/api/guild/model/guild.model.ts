import { Schema } from 'mongoose';

export const GuildSchema = new Schema({
  name: String,
  guildId: String,
  ownerId: String,
  admins: [String],
});

export interface IGuild {
  name: string;
  guildId: string;
  ownerId: string;
  admins: string[];
}
