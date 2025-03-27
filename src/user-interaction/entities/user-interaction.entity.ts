import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from 'src/user/entities/user.entity';
  import { Capsule } from 'src/capsule/entities/capsule.entity';
  
  export enum InteractionType {
    VIEW = 'VIEW',
    LIKE = 'LIKE',
    COMMENT = 'COMMENT',
    SHARE = 'SHARE',
    SAVE = 'SAVE',
  }
  
  @Entity('user_interaction')
  export class UserInteraction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @Column()
    userId: number;
  
    @ManyToOne(() => Capsule, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'capsuleId' })
    capsule: Capsule;
  
    @Column()
    capsuleId: number;
  
    @Column({
      type: 'enum',
      enum: InteractionType,
      default: InteractionType.VIEW,
    })
    interactionType: InteractionType;
  
    @CreateDateColumn()
    timestamp: Date;
  }