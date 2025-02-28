import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { DataEntity } from "./data.entity"

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string // In a real app, this would be hashed

  @Column({ default: false })
  isAdmin: boolean

  @OneToMany(
    () => DataEntity,
    (data) => data.user,
  )
  data: DataEntity[]
}

