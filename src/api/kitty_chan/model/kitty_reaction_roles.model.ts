import { Schema } from 'mongoose';

export const KittyReactionRolesSchema = new Schema({
  name: String,
  guildId: String,
  reaction_role_message_ref: String,
  rolesMapping: Array<any>,
  discordEmbedConfig: Object,
  isActive: {
    type: Boolean,
    default: false,
  },
});

export interface IKittyReactionRoles {
  name: string;
  guildId: string;
  reaction_role_message_ref: string;
  rolesMapping: string[];
  discordEmbedConfig: any;
  isActive: boolean;
}
