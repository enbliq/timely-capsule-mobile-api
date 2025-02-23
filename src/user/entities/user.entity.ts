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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    unique: true, // this ensures email address is unique
  })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    nullable: true, // this allows null values for profilePicture
  })
  profilePicture: string;

  @Column({
    default: false, // set the default value to false
  })
  isGuest: boolean;

  @Column({
    nullable: true, // this allows null values for subscriptionTier
  })
  subscriptionTier: string;

  @Column({
    nullable: true, // this allows null values for walletAddress
    unique: true, // makes the walletAddress to be Unique
  })
  walletAddress: string;

  @CreateDateColumn() // this auto updates date & time upon creation of a user
  createdAt: Date;

  @UpdateDateColumn() // this auto updates date & time upon logIn of a user
  lastLogin: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user) // a USER should also have a one-to-many relationship with the Transaction entity
  transactions: Transaction[];
  
  @OneToMany(() => Capsule, (capsule) => capsule.createdBy) // a USER  should have a one-to-many relationship with the Capsule entity
  capsules: Capsule[];
}
