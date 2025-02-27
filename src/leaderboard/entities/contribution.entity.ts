import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./user.entity"
import { ContributionType } from "../enums/contribution-type.enum"

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "enum",
    enum: ContributionType,
  })
  type: ContributionType

  @Column()
  points: number

  @Column({ nullable: true })
  resourceId: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.contributions,
  )
  user: User

  @Column()
  userId: string
}

