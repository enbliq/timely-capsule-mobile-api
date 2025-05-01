import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type UserDocument = User & Document

export type UserRole = "user" | "admin"
export type CollaboratorRole = "viewer" | "editor" | "co-owner"

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop()
  avatar: string

  @Prop({ required: true, enum: ["user", "admin"], default: "user" })
  role: UserRole

  @Prop({ enum: ["viewer", "editor", "co-owner"] })
  collaboratorRole: CollaboratorRole

  @Prop()
  createdAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
