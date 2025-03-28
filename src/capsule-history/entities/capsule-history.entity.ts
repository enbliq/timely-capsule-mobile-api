import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Capsule } from 'src/capsule/entities/capsule.entity';

export enum CapsuleActionType {
  CREATED = 'CREATED',
  EDITED = 'EDITED',
  TRANSFERRED = 'TRANSFERRED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  EXPIRY_UPDATED = 'EXPIRY_UPDATED',
  UNLOCK_TIME_UPDATED = 'UNLOCK_TIME_UPDATED',
  MEDIA_UPDATED = 'MEDIA_UPDATED',
}

@Entity()
export class CapsuleHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CapsuleActionType })
  actionType: CapsuleActionType;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  @Index()
  timestamp: Date;

  @ManyToOne(() => User, { nullable: false })
  @Index()
  actor: User;

  @ManyToOne(() => Capsule, { nullable: false, onDelete: 'CASCADE' })
  @Index()
  capsule: Capsule;

  // For transfer actions, track the previous and new owners
  @ManyToOne(() => User, { nullable: true })
  previousOwner: User;

  @ManyToOne(() => User, { nullable: true })
  newOwner: User;
}
