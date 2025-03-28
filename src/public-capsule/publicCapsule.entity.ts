import { User } from "src/user/entities/user.entity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm"
  
  @Entity("public_capsules")
  export class PublicCapsule {
    @PrimaryGeneratedColumn("uuid")
    id: string
  
    @Column()
    title: string
  
    @Column("text")
    description: string
  
    @Column("jsonb")
    content: Record<string, any>
  
    @Column({ name: "creator_id" })
    creatorId: string
  
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "creator_id" })
    creator: User
  
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
  }  