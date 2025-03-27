// src/capsules/entities/capsule.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { UserInteraction } from '../../users/entities/user-interaction.entity';

@Entity()
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