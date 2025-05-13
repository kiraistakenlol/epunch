import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class PunchCard {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  loyalty_program_id!: string;

  @Column()
  current_punches!: number;

  @CreateDateColumn()
  created_at!: Date;
} 