import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

export enum LockedFundStatus {
  LOCKED = "LOCKED",
  RELEASED = "RELEASED",
  CANCELLED = "CANCELLED",
}

@Entity("locked_funds")
export class LockedFunds {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  user: User

  @Column()
  userId: string

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number

  @Column()
  currency: string

  @Column("timestamp")
  lockUntil: Date

  @Column({
    type: "enum",
    enum: LockedFundStatus,
    default: LockedFundStatus.LOCKED,
  })
  status: LockedFundStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

