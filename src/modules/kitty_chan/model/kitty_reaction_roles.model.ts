import { Schema } from 'mongoose';

export const KittyReactionRolesSchema = new Schema({
  name: String,
  guildId: String,
  channelId: String,
  reactionRoleMessageRef: String,
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
  channelId: string;
  reactionRoleMessageRef: string;
  rolesMapping: string[];
  discordEmbedConfig: any;
  isActive: boolean;
}
