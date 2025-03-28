import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

@Entity()
export class WebhookEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ type: "json" })
  payload: Record<string, any>

  @CreateDateColumn()
  createdAt: Date
}

