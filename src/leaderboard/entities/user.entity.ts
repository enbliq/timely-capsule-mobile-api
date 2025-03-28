import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Contribution } from "./contribution.entity"

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  username: string

  @Column({ nullable: true })
  avatarUrl: string

  @Column({ default: 0 })
  totalPoints: number

  @OneToMany(
    () => Contribution,
    (contribution) => contribution.user,
  )
  contributions: Contribution[]
}

