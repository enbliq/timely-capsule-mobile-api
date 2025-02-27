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
    nullable: true, // Allow null values for recipientLink
  })
  recipientLink: string;

  @CreateDateColumn()
  unlockAt: Date;

  @CreateDateColumn({
    type: 'timestamptz', 
    default: () => 'CURRENT_TIMESTAMP', 
  })
  expiresAt: Date;

  @Column({
    nullable: true, // Allow null values for this column
  })
  fundId: string;

  @Column({
    default: false, // Set default isClaimed value to false
  })
  isClaimed: boolean;

  @Column({
    default: false, // Set default isGuest value to false
  })
  isGuest: boolean;

  @CreateDateColumn() // auto set value to the current date and time upon creation
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.capsules, {
    //many capsule should have  relation to one USER
    nullable: false, // restrict null values for the createdBy
    onDelete: 'CASCADE', // auto delete Capsule if the related User is deleted
  })
  createdBy: User;

  // a CAPSULE should have a  one-to-many relationship with the GuestCapsuleAccessLog entity
  @OneToMany(() => GuestCapsuleAccessLog, (log) => log.capsule)
  accessLogs: GuestCapsuleAccessLog[];

  // a CAPSULE should have a one-to-many relationship with the Transaction entity
  @OneToMany(() => Transaction, (transaction) => transaction.capsule)
  transactions: Transaction[];
}
