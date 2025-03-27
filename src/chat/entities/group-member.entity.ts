import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ChatGroup } from "./chat-group.entity"

export enum MemberRole {
  ADMIN = "admin",
  MEMBER = "member",
}

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  userId: number

  @Column()
  groupId: string

  @ManyToOne(
    () => ChatGroup,
    (group) => group.members,
  )
  @JoinColumn({ name: "groupId" })
  group: ChatGroup

  @Column({
    type: "enum",
    enum: MemberRole,
    default: MemberRole.MEMBER,
  })
  role: MemberRole

  @CreateDateColumn()
  joinedAt: Date
}

