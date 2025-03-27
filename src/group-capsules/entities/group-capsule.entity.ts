import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity()
export class GroupCapsule {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column("text")
  description: string

  @Column({ nullable: true })
  openDate: Date

  @Column({ default: false })
  isOpened: boolean

  @ManyToMany(
    () => User,
    (user) => user.contributedCapsules,
  )
  @JoinTable()
  contributors: User[]

  @ManyToMany(
    () => User,
    (user) => user.accessibleCapsules,
  )
  @JoinTable()
  viewers: User[]

  @Column("uuid")
  ownerId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

