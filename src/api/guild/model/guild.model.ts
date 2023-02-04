import { Schema } from 'mongoose';

export const GuildSchema = new Schema({
  name: String,
  guildId: String,
  ownerId: String,
});

export interface IGuild {
  name: string;
  guildId: string;
  ownerId: string;
}
