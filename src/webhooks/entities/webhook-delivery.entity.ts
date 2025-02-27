import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { WebhookSubscription } from "./webhook-subscription.entity"

@Entity()
export class WebhookDelivery {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(
    () => WebhookSubscription,
    (subscription) => subscription.deliveries,
  )
  @JoinColumn()
  subscription: WebhookSubscription

  @Column()
  eventName: string

  @Column({ type: "json" })
  payload: Record<string, any>

  @Column({ nullable: true })
  responseStatus: number

  @Column({ type: "text", nullable: true })
  responseBody: string

  @Column({ default: false })
  success: boolean

  @Column({ nullable: true })
  error: string

  @CreateDateColumn()
  createdAt: Date
}

