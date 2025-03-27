// src/users/entities/user-interaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Capsule } from '../../capsules/entities/capsule.entity';

export enum InteractionType {
  VIEW = 'view',
  LIKE = 'like',
  SAVE = 'save',
}

@Entity()
export class UserInteraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  capsuleId: number;

  @Column({
    type: 'enum',
    enum: InteractionType,
    default: InteractionType.VIEW,
  })
  type: InteractionType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Capsule)
  @JoinColumn({ name: 'capsuleId' })
  capsule: Capsule;
}