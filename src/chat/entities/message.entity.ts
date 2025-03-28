import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm"
import { ChatGroup } from "./chat-group.entity"
import { Attachment } from "./attachment.entity"

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  content: string

  @Column()
  senderId: number

  @Column({ nullable: true })
  receiverId: number

  @Column({ nullable: true })
  groupId: string

  @ManyToOne(
    () => ChatGroup,
    (group) => group.messages,
    { nullable: true },
  )
  @JoinColumn({ name: "groupId" })
  group: ChatGroup

  @OneToMany(
    () => Attachment,
    (attachment) => attachment.message,
    { cascade: true },
  )
  attachments: Attachment[]

  @Column({
    type: "enum",
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

