import { Schema } from 'mongoose';

export const KittyReactionRolesSchema = new Schema({
  name: String,
  rolesMapping: Array<any>,
  guildId: String,
});

export interface IKittyReactionRoles {
  name: string;
  rolesMapping: any[];
  guildId: string;
}
