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

@Entity()
export class Capsule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  password: string;

  @Column()
  recipientEmail: string;

  @Column({
    nullable: true,
  })
  recipientLink: string;

  @Column()
  unlockAt: Date;

  @Column()
  expiresAt: Date;

  @Column({
    nullable: true,
  })
  fundId: string;

  @Column({
    default: false,
  })
  isClaimed: boolean;

  @Column({
    default: false,
  })
  isGuest: boolean;

  @CreateDateColumn()
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