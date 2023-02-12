import { Schema } from 'mongoose';

export const KittyReactionRolesSchema = new Schema({
  name: String,
  rolesMapping: Array<any>,
  guildId: String,
  isActive: {
    type: Boolean,
    default: false,
  },
});

export interface IKittyReactionRoles {
  name: string;
  rolesMapping: any[];
  guildId: string;
  isActive: boolean;
}
