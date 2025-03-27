
// src/capsules/entities/capsule.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { UserInteraction } from '../../users/entities/user-interaction.entity';

@Entity()
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
import { UserInteraction } from 'src/user-interaction/entities/user-interaction.entity';

@Entity('capsule')
export class Capsule {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;


  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  media: string;

  @Column('varchar', { nullable: true })
  password?: string;

  @Column()
  recipientEmail: string;

  @Column({ nullable: true })
  recipientLink: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  unlockAt: Date;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  unlockAt: Date

  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })

  expiresAt: Date;

  @Column({ nullable: true })
  fundId: string;

  @Column({ default: false })
  isClaimed: boolean;

  @Column({ default: false })
  isGuest: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Category)
  @JoinTable()
  @ApiProperty({ type: [Category] })
  categories: Category[];

  @ManyToMany(() => Tag)
  @JoinTable()
  @ApiProperty({ type: [Tag] })
  tags: Tag[];

  @OneToMany(() => UserInteraction, interaction => interaction.capsule)
  interactions: UserInteraction[];
}

  @OneToMany(() => UserInteraction, (userInteraction) => userInteraction.capsule)
  interactions: UserInteraction[];

  @OneToMany(() => Transaction, (transaction) => transaction.capsule)
  transactions: Transaction[];
}

