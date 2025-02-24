import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Capsule } from 'src/capsule/entities/capsule.entity';

@Entity()
export class GuestCapsuleAccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guestIdentifier: string;

  @CreateDateColumn() // auto set the  value to the current date and time upon entry
  accessTime: Date;

  @Column() //
  action: string;

  @ManyToOne(() => Capsule, (capsule) => capsule.accessLogs, {
    onDelete: 'CASCADE', // auto delete GuestCapsuleAccessLog if the related Capsule is deleted
  })
  capsule: Capsule; // capsule to take the shape of CAPSULE entity
}
