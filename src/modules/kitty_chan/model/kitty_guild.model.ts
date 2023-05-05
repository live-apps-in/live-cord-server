import { Schema } from 'mongoose';

export const KittyGuildSchema = new Schema({
  name: String,
  guildId: String,
  ownerId: String,
  admins: [String],
  config: {
    type: Object,
    default: {},
  },
});

export interface IKittyGuild {
  name: string;
  guildId: string;
  ownerId: string;
  admins: string[];
  config: any;
}
