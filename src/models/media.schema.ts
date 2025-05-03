import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Schema as MongooseSchema } from "mongoose"

export type MediaDocument = Media & Document

export type MediaType = "image" | "video" | "audio"

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true, enum: ["image", "video", "audio"] })
  type: MediaType

  @Prop({ required: true })
  storageUrl: string

  @Prop({ default: false })
  encrypted: boolean

  @Prop()
  iv: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Capsule" })
  capsuleId: MongooseSchema.Types.ObjectId

  @Prop()
  uploadedAt: Date
}

export const MediaSchema = SchemaFactory.createForClass(Media)
