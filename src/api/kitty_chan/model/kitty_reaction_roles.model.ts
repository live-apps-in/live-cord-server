import { Schema } from 'mongoose';

export const KittyReactionRolesSchema = new Schema({
  name: String,
  discordEmbedConfig: Object,
  guildId: String,
  reaction_role_message_ref: String,
  isActive: {
    type: Boolean,
    default: false,
  },
});

export interface IKittyReactionRoles {
  name: string;
  discordEmbedConfig: any;
  guildId: string;
  reaction_role_message_ref: string;
  isActive: boolean;
}
