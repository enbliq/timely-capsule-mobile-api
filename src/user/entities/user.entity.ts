import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Capsule } from '../../capsules/entities/capsule.entity';

export enum InteractionType {
  VIEW = 'view',
  LIKE = 'like',
  SAVE = 'save',
}

import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Capsule } from 'src/capsule/entities/capsule.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { UserInteraction } from 'src/user-interaction/entities/user-interaction.entity';


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

  @OneToMany(() => UserInteraction, (userInteraction) => userInteraction.user)
  interactions: UserInteraction[];

  @OneToMany(() => Capsule, (capsule) => capsule.createdBy)
  capsules: Capsule[];
}
