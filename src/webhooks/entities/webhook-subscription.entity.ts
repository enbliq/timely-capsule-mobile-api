import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { WebhookDelivery } from "./webhook-delivery.entity"

@Entity()
export class WebhookSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  url: string

  @Column({ default: true })
  active: boolean

  @Column()
  secret: string

  @Column("simple-array")
  events: string[]

  @Column({ nullable: true })
  description: string

  @OneToMany(
    () => WebhookDelivery,
    (delivery) => delivery.subscription,
  )
  deliveries: WebhookDelivery[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

