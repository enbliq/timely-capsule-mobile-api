import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity()
export class TimeCapsule {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "timestamp" })
  openDate: Date

  @ManyToOne(() => User)
  user: User
}

