import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedules } from '../../schedules/entities/schedule.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, type: 'varchar' })
  name: string;

  @Column({ length: 150, type: 'varchar', unique: true })
  email: string;

  @Column({ length: 255, type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'text' })
  refreshToken?: string | null;

  @OneToMany(() => Schedules, (schedule) => schedule.schoolId)
  Schedules: Schedules[];
}
