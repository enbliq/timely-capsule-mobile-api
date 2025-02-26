import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Index(['userId', 'action', 'targetType'])
export class UserAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  action: string;

  @Column()
  targetId: string;

  @Column()
  targetType: string;

  @CreateDateColumn()
  timestamp: Date;
}
