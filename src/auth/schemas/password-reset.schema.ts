import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MongooseSchema } from 'mongoose';

export type PasswordResetDocument = PasswordReset & Document;

@Schema()
export class PasswordReset {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, expires: 3600 }) // Token expires in 1 hour
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
