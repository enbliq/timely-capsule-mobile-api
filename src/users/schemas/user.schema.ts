import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type UserDocument = User & Document;

export type AuthProvider = 'local' | 'google' | 'github' | null;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, unique: true, sparse: true })
  email: string | null;

  @Prop({ required: false })
  passwordHash: string | null;

  @Prop({ required: true })
  displayName: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ default: false })
  guest: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: String,
    enum: ['local', 'google', 'github', null],
    default: null,
  })
  provider: AuthProvider;

  @Prop({ type: Date, default: Date.now })
  lastLoginAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
