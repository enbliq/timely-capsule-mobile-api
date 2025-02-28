import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Message } from "./message.entity"

export enum AttachmentType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
  AUDIO = "audio",
}

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  url: string

  @Column()
  filename: string

  @Column({
    type: "enum",
    enum: AttachmentType,
  })
  type: AttachmentType

  @Column()
  size: number

  @Column()
  messageId: string

  @ManyToOne(
    () => Message,
    (message) => message.attachments,
  )
  @JoinColumn({ name: "messageId" })
  message: Message

  @CreateDateColumn()
  createdAt: Date
}

