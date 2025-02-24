import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'; 
import { User } from 'src/user/entities/user.entity'; 
import { Capsule } from 'src/capsule/entities/capsule.entity'; 

@Entity() 
export class Transaction {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({
    type: 'decimal', 
    nullable: false, //restrict null values for amount 
  })
  amount: number;

  @Column({
    type: 'varchar',
  })
  currency: string;

  @Column({
    type: 'varchar',
  })
  status: string;

  @Column({
    type: 'text', // Specify the column type as text
    nullable: true, // allow null values for transactionHash
  })
  transactionHash: string;

  @Column({
    type: 'varchar', 
    length: 20, // Set the maximum length of the column
  })
  type: string;

  @CreateDateColumn() // auto set the column value to the current date and time upon creation
  createdAt: Date;

  @UpdateDateColumn() // auto update the column value to the current date and time upon update
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false, //restrict null values for the user column
    eager: true, // auto load related user entities 
  })
  user: User;

  @ManyToOne(() => Capsule, (capsule) => capsule.transactions, {
    nullable: true, // Allow null values for the capsule column
    eager: true, // auto looad related capsule entities 
  })
  capsule: Capsule;
}
