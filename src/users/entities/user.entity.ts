import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
