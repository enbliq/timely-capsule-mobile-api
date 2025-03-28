import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Message } from "./message.entity"
import { GroupMember } from "./group-member.entity"

@Entity()
export class ChatGroup {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  avatarUrl: string

  @Column()
  creatorId: number

  @OneToMany(
    () => Message,
    (message) => message.group,
  )
  messages: Message[]

  @OneToMany(
    () => GroupMember,
    (member) => member.group,
    { cascade: true },
  )
  members: GroupMember[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

