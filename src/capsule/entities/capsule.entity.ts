import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { GuestCapsuleAccessLog } from 'src/guest/entities/guest.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Entity('capsule')
export class Capsule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    nullable: true,
  })
  media: string;

  @Column('varchar', { nullable: true })
  password?: string;

  @Column()
  recipientEmail: string;

  @Column({
    nullable: true,
  })
  recipientLink: string;

  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  unlockAt: Date;

  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expiresAt: Date;

  @Column({
    nullable: true,
  })
  fundId: string;

  @Column({ default: false })
  @Column({
    default: false,
  })
  isClaimed: boolean;

  @Column({
    default: false,
  })
  isGuest: boolean;

  @CreateDateColumn({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.capsules, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @OneToMany(() => GuestCapsuleAccessLog, (log) => log.capsule)
  accessLogs: GuestCapsuleAccessLog[];

  @OneToMany(() => Transaction, (transaction) => transaction.capsule)
  transactions: Transaction[];
}
