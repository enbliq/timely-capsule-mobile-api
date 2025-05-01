import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Schema as MongooseSchema } from "mongoose"

export type FundDocument = Fund & Document

@Schema({ timestamps: true })
export class Fund {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Capsule", required: true })
  capsuleId: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  currency: string

  @Prop({ required: true })
  amount: number

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  senderId: MongooseSchema.Types.ObjectId

  @Prop()
  claimConditions: string

  @Prop()
  createdAt: Date
}

export const FundSchema = SchemaFactory.createForClass(Fund)
