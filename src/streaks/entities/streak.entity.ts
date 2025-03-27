import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity()
export class Streak {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 0 })
  currentStreak: number

  @Column({ default: 0 })
  longestStreak: number

  @Column({ nullable: true, type: "timestamp" })
  lastCapsuleDate: Date

  @OneToOne(
    () => User,
    (user) => user.streak,
  )
  @JoinColumn()
  user: User
}

