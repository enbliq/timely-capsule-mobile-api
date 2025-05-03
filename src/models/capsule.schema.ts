import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Schema as MongooseSchema } from "mongoose"

export type CapsuleDocument = Capsule & Document

export type CapsuleType = "standard" | "secretDrop" | "lab" | "admin"

@Schema({ timestamps: true })
export class Capsule {
  @Prop({ required: true })
  title: string

  @Prop({ type: [String], default: [] })
  content: string[]

  @Prop({ required: true, unique: true })
  capsuleLink: string

  @Prop({ required: true })
  openAt: Date

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  ownerId: MongooseSchema.Types.ObjectId

  @Prop({ default: false })
  isPublic: boolean

  @Prop({ default: false })
  isPasswordProtected: boolean

  @Prop({ type: [String], default: [] })
  tags: string[]

  @Prop({ required: true, enum: ["standard", "secretDrop", "lab", "admin"] })
  capsuleType: CapsuleType

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: "User", default: [] })
  collaborators: MongooseSchema.Types.ObjectId[]

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: "Media", default: [] })
  media: MongooseSchema.Types.ObjectId[]

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Fund" })
  funds: MongooseSchema.Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Geolock" })
  geolockId: MongooseSchema.Types.ObjectId

  @Prop({
    type: {
      algorithm: { type: String, enum: ["AES-256-GCM"] },
      encrypted: { type: Boolean, default: false },
      iv: String,
    },
  })
  encryption?: {
    algorithm: "AES-256-GCM"
    encrypted: boolean
    iv: string
  }

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: Record<string, any>

  @Prop()
  createdAt: Date
}

export const CapsuleSchema = SchemaFactory.createForClass(Capsule)
