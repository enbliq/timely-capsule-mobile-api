import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from "typeorm"
import { UserEntity } from "./user.entity"

@Entity("data")
export class DataEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column("text")
  content: string

  @Column({ nullable: true })
  category: string

  @ManyToOne(
    () => UserEntity,
    (user) => user.data,
  )
  @Index() // Add index for better query performance
  user: UserEntity

  @CreateDateColumn()
  @Index() // Add index for sorting and filtering
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

