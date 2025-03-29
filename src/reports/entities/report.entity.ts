import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Capsule } from "../../capsules/entities/capsule.entity"

export enum ReportStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  CLOSED = "closed",
}

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Capsule, { onDelete: "CASCADE" })
  capsule: Capsule

  @Column()
  capsuleId: string

  @Column({ type: "text" })
  reason: string

  @ManyToOne(() => User)
  reportedBy: User

  @Column()
  reportedById: string

  @Column({
    type: "enum",
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

