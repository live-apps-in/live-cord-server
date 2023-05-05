import { Schema, Types } from 'mongoose';

export const AuthSchema = new Schema({
  userId: Types.ObjectId,
  _2fa: {
    type: Object,
    default: {
      otp: null,
      signature: null,
    },
  },
});

export interface IAuth {
  userId: string;
  _2fa: any;
}
