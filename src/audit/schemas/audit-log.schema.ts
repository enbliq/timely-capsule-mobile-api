import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  resource: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  details: any;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  userId: MongooseSchema.Types.ObjectId;

  @Prop()
  userEmail: string;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
